var React = require("react/addons");
var types = React.PropTypes;
var Opentip = require('opentip');
require('opentip/css/opentip.css');

module.exports = React.createClass({
  propTypes: {
  	label: types.string,
  	value: types.any,
  	onClick: types.func,
    addAll: types.bool,
    tooltipContent: types.string
  },
  handleClick: function(){
  	this.props.onClick(this.props.value);
  },
  createTooltip: function(tooltipContent, component) {
    if(component === null) {
      return;
    }

    if(component.tooltip) {
      return;
    }

    component.tooltip = new Opentip(React.findDOMNode(component), tooltipContent, {delay: 0});
  },
  render: function() {
    var className = "rxs-option-list-item", hoverIcon = "";
    if(this.props.addAll)
      className += " add-all";
    if(this.props.tooltipContent && this.props.tooltipContent !== "") {
      hoverIcon = (
        <div className="hover-icon" ref={this.createTooltip.bind(this, this.props.tooltipContent)}>i</div>
      );
    }
    return <div className={className}><button className="rxs-option-button" onClick={this.handleClick}>{this.props.label}{hoverIcon}</button></div>;
  }
});
