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
    tooltipContent: types.string,
    customOptionTag: types.string, //can be html in string form
    tagTipContent: types.string //tool tip content for the custom option tag
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
    var className = "rxs-option-list-item", hoverIcon = "", customOptionTag = "";
    if(this.props.addAll)
      className += " add-all";
    if(this.props.tooltipContent && this.props.tooltipContent !== "") {
      hoverIcon = (
        <div className="hover-icon" ref={this.createTooltip.bind(this, this.props.tooltipContent)}>i</div>
      );
    }
    if(this.props.customOptionTag && this.props.customOptionTag !== "") {
      customOptionTag = (
        <div className="custom-option-tag" ref={this.createTooltip.bind(this, this.props.tagTipContent)} dangerouslySetInnerHTML={{__html: this.props.customOptionTag}}></div>
      );
    }
    return <div className={className}><button className="rxs-option-button" onClick={this.handleClick}>{this.props.label}{customOptionTag}{hoverIcon}</button></div>;
  }
});
