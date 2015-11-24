var React = require("react/addons");
var types = React.PropTypes;
var OptionList = require("./components/option-list.jsx");
var ReactCompactMultiselect = require("react-compact-multiselect");
var TagList = require("react-tag-list");
var SkyLight = require('react-skylight');
var IsMobileMixin = require('react-ismobile-mixin');

require("./react-xzibit-select.scss");

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
		options: types.array,
		optionsByValue: types.any,
		values: types.array,
		onChange: types.func,
		filterDimensions: types.array,
		addAll: types.bool,
		addAllLimit: types.number
	},
	mixins: [IsMobileMixin],
	getDefaultProps: function() {
		return {
			addAll: true,
			placeholderText: "Choose a value below or type to filter options",
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
        tipJoint: "top left",
        stem: false
      }
		};
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
		return this.props.options.filter(function(opt){
			if(this.props.values.indexOf(opt.value) !== -1 || !this.dimensionFilterIncludes(opt)) return false;
			return (opt.label.toLowerCase().indexOf(this.state.labelFilter.toLowerCase()) > -1);
			
		}, this);
	},
	onMobileTooltip: function(title, content) {
		if(!this.isMobile()) {
			return;
		}

		var skylight = this.refs.tooltip;

		this.setState({mobileTooltipTitle: title, mobileTooltipContent: content},
			this.refs.tooltip.show)
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
		 *  {"Source" : [], "Sector" : []}
		 */
		return function(values) {
			var spec = {};
			spec[dimensionName] = {$set: values};
			var newState = React.addons.update(this.state.dimensionFilter, spec);
			this.setState({dimensionFilter: newState});
		}.bind(this);
	},
	tagListValues: function() {
		// SLOW!! too slow??
		// ...fixing...
		// I might have fixed it -Stephen

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
	render: function() {
		var filteredOptions = this.filteredOptions();
		var selectFilters = this.props.filterDimensions.map(function(dim){
			var groupByKey = "";
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

		var addAll = this.props.addAll;
		if(this.props.addAllLimit && filteredOptions.length > this.props.addAllLimit) {
			addAll=false;
		}

		var skylight = null;
    if(this.isMobile()) {
      skylight = (
        <SkyLight
          ref="tooltip"
          title={this.state.mobileTooltipTitle}
          className="mobile-tooltip">
          {this.state.mobileTooltipContent}
        </SkyLight>
      );
    }

		return (
			<div className="react-xzibit-select">
				<div className="fluid-layout">
					<div className="header">
						<div className="rxs-label-filter">
							<div className="rsv-label-filter-container">
							<input  
								onChange={this.updateLabelFilter} 
								value={this.state.labelFilter} 
								placeholder={this.props.placeholderText} />
							<button className="rxs-label-filter-clear" name="clear-filter" onClick={this.clearLabelFilter}>&#215;</button>
							</div>
						</div>
						<TagList 
							values={this.tagListValues()} 
							onRemove={this.removeValue}
							removeAll={this.removeAll}
							collapsedRows={1} />
					</div>
					<OptionList 
						options={filteredOptions} 
						onClick={this.addValue}
						addAll={addAll}
						addAllFunc={this.addAllFunc}
						onMobileTooltip={this.onMobileTooltip}/>
					<div className="footer">
						<div className="filter-multiselect">
						{selectFilters}
						</div>
					</div>
				</div>
				{skylight}
			</div>
		);
	}
});

module.exports = XzibitSelect;