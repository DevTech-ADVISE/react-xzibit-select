var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var XzibitSelect = require('./src/react-xzibit-select');
var testData = require('./src/test-data');
var _ = require('lodash');


var DemoXzibitSelect = createReactClass({
  getInitialState: function(){
    return {
      values: [],
      searchFilterValue: 'melon',
      dimensionFilters: {},
    };
  },
  options: function() {
    return testData.fruits;
  },
  filterDimensionOptions: function() {
    var colorOptions = _.uniq(testData.fruits.map(function(fruit){
      if (Array.isArray(fruit.color)){
        return fruit.color[0];
      }
      return fruit.color;
    })).map(function(color){
      return {value: color, label: color};
    });
    var groupPlantsKey = 'size';
    var growsOnOptions = _.uniq(testData.fruits.map(function(fruit){
      var dimension = {};
      if (Array.isArray(fruit.growsOn)){
        dimension.growsOn = fruit.growsOn[0];
        dimension.groupByKey = fruit[groupPlantsKey];
        return dimension;
      }
      dimension.growsOn = fruit.growsOn;
      dimension.groupByKey = fruit[groupPlantsKey];
      return dimension;
    }), 'growsOn').map(function(growsOn){
      var dimension = {};
      dimension.value = growsOn.growsOn;
      dimension.label = growsOn.growsOn;
      dimension[groupPlantsKey] = growsOn.groupByKey;
      return dimension;
    });

    return [
      {name: 'Color',
       key: 'color',
       options: colorOptions},
      {name: 'Grows On',
       key: 'growsOn',
       options: growsOnOptions,
       groupByKey: groupPlantsKey}
    ];
  },
  onChange: function(values){
    this.setState({values: values});
    console.log(values);
  },
  onSearchFilterChange: function(value) {
    this.setState({ searchFilterValue: value })
  },
  onClearSearchFilter: function() {
    this.setState({searchFilterValue: ''})
  },
  onDimensionSelectionChange: function(dimensionName, values) {
    const newDimensionFilters = Object.assign({}, this.state.dimensionFilters)
    const currentFilterValue = (newDimensionFilters[dimensionName]) ? newDimensionFilters[dimensionName].filterValue : ''
    newDimensionFilters[dimensionName] = { selectedValues: values, filterValue: currentFilterValue }
    this.setState({ dimensionFilters: newDimensionFilters })
  },
  onDimensionFilterValueChange: function(dimensionName, value) {
    const newDimensionFilters = Object.assign({}, this.state.dimensionFilters)
    const currentDimensionSelection = (newDimensionFilters[dimensionName]) ? newDimensionFilters[dimensionName].selectedValues : []
    newDimensionFilters[dimensionName] = { selectedValues: currentDimensionSelection, filterValue: value }
    this.setState({ dimensionFilters: newDimensionFilters })
  },
  onClearDimensionFilterValue: function(dimensionName) {
    this.onDimensionFilterValueChange(dimensionName, '')
  },
  render: function() {
    //var divStyles = {height: 600, width: 800, border: '1px solid #aaa;'}; width and height are fluid meaning whatever container we place this in it will fill,
    //alternately you can also add a fixed width / height here to constrain the layout
    var divStyles = {boxShadow: '0px 0px 0px 1px #cacaca', marginTop: '10px'};

    return (
      <div className="demo-container" style={{ height: '90%' }}>
        Controls: <button onClick={this.onClearSearchFilter}>Clear Main Search Filter</button>
        <button onClick={() => this.setState({ dimensionFilters: {} })}>Clear All Dimension selections and Dimension Filters</button>
        <div style={divStyles}>
          <XzibitSelect
            options={this.options()}
            values={this.state.values}
            onChange={this.onChange}
            onSearchFilterChange={this.onSearchFilterChange}
            onClearSearchFilter={this.onClearSearchFilter}
            onDimensionSelectionChange={this.onDimensionSelectionChange}
            onDimensionFilterValueChange={this.onDimensionFilterValueChange}
            onClearDimensionFilterValue={this.onClearDimensionFilterValue}
            searchFilterValue={this.state.searchFilterValue}
            dimensionFilters={this.state.dimensionFilters}
            filterDimensionOptions={this.filterDimensionOptions()}/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(React.createElement(DemoXzibitSelect), document.getElementById('main'));
