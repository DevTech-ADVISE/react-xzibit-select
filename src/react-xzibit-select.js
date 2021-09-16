var React = require('react');
var createReactClass = require('create-react-class');
var update = require('react-addons-update');
var types = require('prop-types');
var OptionList = require('./components/option-list');
var ReactCompactMultiselect = require('react-compact-multiselect');
var TagList = require('react-tag-list');
var SkyLight = require('react-skylight').default;
var IsMobileMixin = require('react-ismobile-mixin');
var lunr = require('lunr')
var _ = require('lodash')
var ReactDebounceInput = require('react-debounce-input')
var DebounceInput = ReactDebounceInput.DebounceInput
require('./react-xzibit-select.scss');

var XzibitSelect = createReactClass({
  getInitialState: function() {
    return {
      mobileTooltipContent: null,
      mobileTooltipTitle: null,
      searchIndex: this.generateSearchIndex(this.props.searchFields, this.props.refField, this.props.options, this.props.values, this.props.dimensionFilters)
    };
  },

  propTypes: {
    addAll: types.bool,
    addAllLimit: types.number,
    filterChangeThrotleMs: types.number,
    filterDimensionOptions: types.array,
    dimensionFilters: types.object,
    searchFilterValue: types.string,
    searchFilterDebounceTime: types.number,
    onDimensionSelectionChange: types.func,
    onDimensionFilterValueChange: types.func,
    onClearDimensionFilterValue: types.func,
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
      dimensionFilters: {},
      searchFilterValue: '',
      searchFilterDebounceTime: 200,
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

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.searchFilterValue !== this.props.searchFilterValue) {
      this.setLunrResults(nextProps.searchFilterValue)
    }
  },

  generateSearchIndex: function(searchFields, refField, data, currentlySelectedValues, currentDimensionFilters) {
    var componentThis = this
    var search = lunr(function() {
      var lunrThis = this
      searchFields.forEach(function (field) {
        var name = field.name || field
        var weight = field.weight || 1
        lunrThis.field(name, weight)
      })

      lunrThis.ref(refField)

      componentThis.fillSearch(lunrThis, data, currentlySelectedValues, currentDimensionFilters)
    })

    return search
  },

  getAvailableOptions: function(options, currentlySelectedValues, currentDimensionFilters) {
    return options.filter(function (opt) {
      var isSelected = currentlySelectedValues.indexOf(opt.value) !== -1
      var isInDimension = this.dimensionFilterIncludes(opt, currentDimensionFilters)
      return !isSelected && isInDimension
    }, this)
  },

  fillSearch: function(search, options, currentlySelectedValues, currentDimensionFilters) {
    // Note that we fill the search index with all of the options, later on if there are less available options, then
    // we must remove those options from search results after the search is done.
    // This is a performance improvement, originally we would recreate the search index on every component update(eg. adding/removing options), which takes a long time for a large number of options
    options.forEach(function (opt) {
      search.add(opt)
    })
  },

  subStringSearch: function (searchInput, options, currentlySelectedValues, currentDimensionFilters) {
    return this.getAvailableOptions(options, currentlySelectedValues, currentDimensionFilters).filter(function(opt) {
      var foundValue = false
      for(var i = 0; i < this.props.searchFields.length; i ++){
        var fieldValue = opt[this.props.searchFields[i]].toLowerCase()
        // If the searchInput exists in the fieldValue
        // break and keep this option in the list
        if(fieldValue.indexOf(searchInput) > -1) {
          foundValue = true
          break
        }
      }
      return foundValue
    }.bind(this))
    .map(function(opt) { return opt[this.props.refField]}, this)
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
    var filteredOptionValues = this.filteredOptions(this.props.options, this.props.values, this.props.dimensionFilters).map(function(opt){ return opt.value;});
    var newValueState = filteredOptionValues.concat(this.props.values);
    this.props.onChange(newValueState);
  },

  mergeResults: function (array1, array2) {
    // Remove any values from array1 that exist in array2
    var array2MinusArray1 = array2.filter(function(a2Element) {
      return array1.indexOf(a2Element) === -1
    })
    // Then concat the arrays that now have no duplicates
    // This is more performant than doing the concat upfront
    return array1.concat(array2MinusArray1)
  },

  setLunrResults: function(searchFilterValue) {
    // search using the lunr search index
    var lunrResults = this.state.searchIndex.search(searchFilterValue.toLowerCase())
    .map(function(result) {
      return result.ref
    }).map(function(result) {
      return String(result) // make sure the ref is a string for merging results comparison later
    })

    this.setState({ lunrResults: lunrResults })
  },

  filteredOptions: function(options, currentlySelectedValues, currentDimensionFilters) {
    var searchFilterValue = this.props.searchFilterValue.toLowerCase()
    if(!searchFilterValue) {
      return this.getAvailableOptions(options, currentlySelectedValues, currentDimensionFilters)
    }

    // lunr doesn't filter on a or i
    if(searchFilterValue === 'a' || searchFilterValue === 'i') {
      return this.getAvailableOptions(options, currentlySelectedValues, currentDimensionFilters)
    }

    var lunrResults = this.state.lunrResults || []
    var substringResults = this.subStringSearch(searchFilterValue.toLowerCase(), options, currentlySelectedValues, currentDimensionFilters).map(function(result) {
      return String(result) // make sure the ref is a string for merging results comparison later
    })
    var mergedResults = this.mergeResults(lunrResults, substringResults)
    var optionMap = {}
    this.props.options.forEach(function (opt) {
      var ref = opt[this.props.refField]
      optionMap[ref] = opt
    }, this)
    var lunrResultsAsOptions = mergedResults.map(function(resultRef) {
      return optionMap[resultRef]
    })
    var onlyAvailableResultsOptions = this.getAvailableOptions(lunrResultsAsOptions, currentlySelectedValues, currentDimensionFilters)

    return onlyAvailableResultsOptions
  },

  onMobileTooltip: function(title, content) {
    if(!this.isMobile()) {
      return;
    }

    this.setState(
      {mobileTooltipTitle: title, mobileTooltipContent: content},
      this.refs.tooltip.show);
  },

  dimensionFilterIncludes: function(opt, currentDimensionFilters) {
    if (Object.keys(currentDimensionFilters).length < 1){
      return true;
    }

    var retVal = true;
    var filterHits = this.props.filterDimensionOptions.map(function(dimension){
      var key = dimension.key;
      var name = dimension.name;
      var filterVals = (currentDimensionFilters[name]) ? currentDimensionFilters[name].selectedValues : undefined
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

  handleSearchFilterChange: function(event) {
    this.props.onSearchFilterChange(event.target.value)
  },

  clearSearchFilter: function() {
    this.props.onClearSearchFilter()
  },

  updateSearchIndex: function(props) {
    this.setState({ searchIndex: this.generateSearchIndex(props.searchFields, props.refField, props.options, props.values, props.dimensionFilters) })
  },

  generateUpdateDimensionSelection: function(dimensionName) {
    // Re-generate the search index any time a dimension selection is made so that the index correctly
    // corresponds to the new list of options filtered by the dimension selection
    /**
     *  {'Source' : [], 'Sector' : []}
     */
    return function(values) {
      this.props.onDimensionSelectionChange(dimensionName, values)
    }.bind(this);
  },

  generateUpdateDimensionFilterValue: function(dimensionName) {
    return function(value) {
      this.props.onDimensionFilterValueChange(dimensionName, value)
    }.bind(this)
  },

  generateClearDimensionFilterValue: function(dimensionName) {
    return function(value) {
      this.props.onClearDimensionFilterValue(dimensionName)
    }.bind(this)
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
    return this.props.filterDimensionOptions.map(function(dim) {
      var groupByKey = '';
      if(dim.groupByKey)
        groupByKey = dim.groupByKey;

      const dimensionFilter = this.props.dimensionFilters[dim.name] || {}
      const selectedValuesForDimension = dimensionFilter.selectedValues || []
      const filterValueForDimension = dimensionFilter.filterValue || ''

      return (<ReactCompactMultiselect
            key={dim.name}
            label={dim.name}
            options={dim.options}
            info={dim.info}
            selectedValues={selectedValuesForDimension}
            onSelectionChange={this.generateUpdateDimensionSelection(dim.name)}
            filterValue={filterValueForDimension}
            onFilterValueChange={this.generateUpdateDimensionFilterValue(dim.name)}
            onClearFilter={this.generateClearDimensionFilterValue(dim.name)}
            groupBy={groupByKey}
            layoutMode={ReactCompactMultiselect.ALIGN_CONTENT_NE} />);
    }, this);
  },

  render: function() {
    var filteredOptions = this.filteredOptions(this.props.options, this.props.values, this.props.dimensionFilters);
    var selectFilters = this.getSelectFilters();
    var addAll = this.props.addAll && !(this.props.addAllLimit && filteredOptions.length > this.props.addAllLimit);

    return (
      <div className='react-xzibit-select'>
        <div className='fluid-layout'>
          <div className='header'>
            <div className='rxs-label-filter'>
              <div className='rsv-label-filter-container'>
              <DebounceInput
                debounceTimeout={this.props.searchFilterDebounceTime}
                onChange={this.handleSearchFilterChange}
                value={this.props.searchFilterValue}
                placeholder={this.props.placeholderText}
              />
              <button className='rxs-label-filter-clear' name='clear-filter' onClick={this.clearSearchFilter}>&#215;</button>
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
            onMobileTooltip={this.onMobileTooltip}
            openTipOptions={this.props.openTipOptions}/>
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

module.exports = XzibitSelect
