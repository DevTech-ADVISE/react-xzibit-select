var React = require('react');
var ReactDOM = require('react-dom');
var XzibitSelect = require('./src/react-xzibit-select');
var testData = require('./src/test-data');
var _ = require('lodash');


var DemoXzibitSelect = React.createClass({
	getInitialState: function(){
		return {
			values: []
		};
	},
	options: function() {
		return testData.fruits;
	},
	filterDimensions: function() {
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
	render: function() {
		//var divStyles = {height: 600, width: 800, border: '1px solid #aaa;'}; width and height are fluid meaning whatever container we place this in it will fill,
		//alternately you can also add a fixed width / height here to constrain the layout
		var divStyles = {boxShadow: '0px 0px 0px 1px #cacaca'};


		return (
			<div style={divStyles}>
				<XzibitSelect
					options={this.options()}
					values={this.state.values}
					onChange={this.onChange}
					initialFilter='melon'
					filterDimensions={this.filterDimensions()}/>
			</div>
		);
	}
});

ReactDOM.render(React.createElement(DemoXzibitSelect), document.getElementById('main'));
