var React = require('react');
var update = require('react-addons-update');
var types = React.PropTypes;
var OptionList = require('./components/option-list');
var ReactCompactMultiselect = require('react-compact-multiselect');
var TagList = require('react-tag-list');
var SkyLight = require('react-skylight').default;
var IsMobileMixin = require('react-ismobile-mixin');
var lunr = require('lunr')

require('./react-xzibit-select.scss');

var XzibitSelect = React.createClass({
	getInitialState: function() {
		return {
			labelFilter: '',
			dimensionFilter: {},
			mobileTooltipContent: null,
			mobileTooltipTitle: null
		};
	},

	propTypes: {
		addAll: types.bool,
		addAllLimit: types.number,
		filterChangeThrotleMs: types.number,
		filterDimensions: types.array,
		onChange: types.func,
		options: types.array,
		optionsByValue: types.any,
		refField: types.string,
		searchFields: types.array,
		values: types.array
	},

	mixins: [IsMobileMixin],

	getDefaultProps: function() {
		return {
			addAll: true,
			filterChangeThrotleMs: 200,
			placeholderText: 'Type here to filter options',
      openTipOptions: {
        offset: [3, 10],
        borderRadius: 2,
        borderColor: '#333333',
        background: '#333333',
        className: 'rxs-tooltip',
        delay: 0,
        hideDelay: 0,
        showEffectDuration: 0,
        hideEffectDuration: 0,
        tipJoint: 'top left',
        stem: false
      },
			refField: 'value',
			searchFields: ['label']
		};
	},

	componentWillMount: function() {
		this.blankSearch()
	},

	componentWillReceiveProps: function() {
		this.blankSearch()
	},

	blankSearch: function() {
		this.search = null
	},

	getSearch: function() {
		if (!this.search) {
			this.search = this.makeSearch(this.props.searchFields, this.props.refField)
			this.fillSearch(this.search, this.props.options)
		}

		return this.search
	},

	makeSearch: function(searchFields, refField) {
		var search = lunr(function() {
			var lunrThis = this
			searchFields.forEach(function (field) {
				var name = field.name || field
				var weight = field.weight || 1
				lunrThis.field(name, weight)
			})

			lunrThis.ref(refField)
		})

		return search
	},

	getAvailableOptions: function(options) {
		return options.filter(function (opt) {
			var isSelected = this.props.values.indexOf(opt.value) !== -1
			var isInDimension = this.dimensionFilterIncludes(opt)
			return !isSelected && isInDimension
		}, this)
	},

	fillSearch: function(search, options) {
		this.getAvailableOptions(options).forEach(function (opt) {
			search.add(opt)
		})
	},

	removeValue: function(valToRemove) {
		var newValueState = this.props.values.filter(function(val){
			return val !== valToRemove;
		});
		this.props.onChange(newValueState);
	},

	removeAll: function() {
		this.props.onChange([]);
	},

	addValue: function(valToAdd){
		var newValueState = this.props.values.slice(0);
		newValueState.push(valToAdd);
		this.props.onChange(newValueState);
	},

	addAllFunc: function() {
		var filteredOptionValues = this.filteredOptions().map(function(opt){ return opt.value;});
		var newValueState = filteredOptionValues.concat(this.props.values);
		this.props.onChange(newValueState);
	},

	filteredOptions: function() {
		var labelFilter = this.state.labelFilter.toLowerCase()
		if(!labelFilter) {
			return this.getAvailableOptions(this.props.options)
		}

		// lunr doesn't filter on a or i
		if(labelFilter === 'a' || labelFilter === 'i') {
			return this.getAvailableOptions(this.props.options)
		}

		var results = this.getSearch().search(this.state.labelFilter.toLowerCase())

		var optionMap = {}
		this.props.options.forEach(function (opt) {
			var ref = opt[this.props.refField]
			optionMap[ref] = opt
		}, this)

		return results.map(function(r) {
			return optionMap[r.ref]
		})
	},

	onMobileTooltip: function(title, content) {
		if(!this.isMobile()) {
			return;
		}

		this.setState(
			{mobileTooltipTitle: title, mobileTooltipContent: content},
			this.refs.tooltip.show);
	},

	dimensionFilterIncludes: function(opt) {
		if (Object.keys(this.state.dimensionFilter).length < 1){
			return true;
		}

		var retVal = true;

		var filterHits = this.props.filterDimensions.map(function(dimension){
			var key = dimension.key;
			var name = dimension.name;
			var filterVals = this.state.dimensionFilter[name];
			if (filterVals === undefined || filterVals.length < 1) {
				return true;
			}
			if (Array.isArray(opt[key])){
				var found = false;
				opt[key].forEach(function(optVal){
					if (filterVals.indexOf(optVal) > -1) {
						found = true;
					}
				});
				return found;
			} else {
				if (filterVals.indexOf(opt[key]) > -1) {
					return true;
				}
			}
			return false;
		}, this);

		filterHits.forEach(function(fh){
			if (!fh){
				retVal = false;
			}
		});

		return retVal;
	},



	updateLabelFilter: function(event) {
		// TODO: add throttling
		this.setState({labelFilter: event.target.value});
	},

	clearLabelFilter: function() {
	  this.setState({labelFilter: ''});
	},

	generateUpdateDimensionFilter: function(dimensionName) {
		/**
		 *  {'Source' : [], 'Sector' : []}
		 */
		return function(values) {
			var spec = {};
			spec[dimensionName] = {$set: values};
			var newState = update(this.state.dimensionFilter, spec);
			this.setState({dimensionFilter: newState});
		}.bind(this);
	},

	tagListValues: function() {
		var mapFunc = function(){};

		if (this.props.optionsByValue) {
			mapFunc = function(val){
				return this.props.optionsByValue[val];
			};
		} else {
			mapFunc = function(val){
			  return this.props.options.filter(function(opt){
					return opt.value === val;
				})[0];
			};
		}

		return this.props.values.map(mapFunc, this);
	},

	getSkylight: function() {
		if (!this.isMobile()) {
			return null;
		}

		return (
			<SkyLight
				ref='tooltip'
				title={this.state.mobileTooltipTitle}
				className='mobile-tooltip'>
				{this.state.mobileTooltipContent}
			</SkyLight>
		);
	},

	getSelectFilters: function() {
		return this.props.filterDimensions.map(function(dim) {
			var groupByKey = '';
			if(dim.groupByKey)
				groupByKey = dim.groupByKey;

			return (<ReactCompactMultiselect
						key={dim.name}
						label={dim.name}
						options={dim.options}
						info={dim.info}
						initialValue={[]}
						groupBy={groupByKey}
						onChange={this.generateUpdateDimensionFilter(dim.name)}
						layoutMode={ReactCompactMultiselect.ALIGN_CONTENT_NE} />);
		}, this);
	},

	render: function() {
		var filteredOptions = this.filteredOptions();
		var selectFilters = this.getSelectFilters();
		var addAll = this.props.addAll && !(this.props.addAllLimit && filteredOptions.length > this.props.addAllLimit);

		return (
			<div className='react-xzibit-select'>
				<div className='fluid-layout'>
					<div className='header'>
						<div className='rxs-label-filter'>
							<div className='rsv-label-filter-container'>
							<input
								onChange={this.updateLabelFilter}
								value={this.state.labelFilter}
								placeholder={this.props.placeholderText} />
							<button className='rxs-label-filter-clear' name='clear-filter' onClick={this.clearLabelFilter}>&#215;</button>
							</div>
						</div>
						<TagList
							values={this.tagListValues()}
							onRemove={this.removeValue}
							removeAll={this.removeAll}
							placeholderText='&nbsp;'
							collapsedRows={1} />
					</div>
					<OptionList
						options={filteredOptions}
						onClick={this.addValue}
						addAll={addAll}
						addAllFunc={this.addAllFunc}
						onMobileTooltip={this.onMobileTooltip}/>
					<div className='footer'>
						<div className='filter-multiselect'>
						{selectFilters}
						</div>
					</div>
				</div>
				{this.getSkylight()}
			</div>
		);
	}
});

module.exports = XzibitSelect;
