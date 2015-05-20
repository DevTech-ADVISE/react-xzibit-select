var React = require("react/addons");
var types = React.PropTypes;

module.exports = React.createClass({
  propTypes: {
  	label: types.string,
  	value: types.any,
  	onClick: types.func
  },
  handleClick: function(){
  	this.props.onClick(this.props.value);
  },
  render: function() {
    return <li><button className="rxs-option-list-item" onClick={this.handleClick}>{this.props.label}</button></li>;
  }
});
