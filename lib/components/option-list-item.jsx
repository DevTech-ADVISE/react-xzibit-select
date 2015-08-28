var React = require("react/addons");
var Opentip = require('opentip');
var SkyLight = require('react-skylight');
var IsMobileMixin = require('../mixins/IsMobileMixin.jsx');
require('opentip/css/opentip.css');

var OptionListItem = React.createClass({
  // propTypes: {
  // 	label: types.any,
  // 	value: types.any,
  // 	onClick: types.func,
  //   addAll: types.bool,
  //   toolTipContent: types.string,
  //   toolTipTitle: types.string,
  //   openTipOptions: types.object
  // },
  getDefaultProps: function() {
    return {
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
  mixins: [IsMobileMixin],
  handleClick: function(){
    this.props.onClick(this.props.value);
  },
  createTooltip: function(component) {
    if(component === null || this.tooltip || this.isMobile()) {
      return;
    }

    this.tooltip = new Opentip(React.findDOMNode(component), this.props.toolTipContent, this.props.toolTipTitle, this.props.openTipOptions);
  },
  componentDidUpdate: function() {
    //handles mouse-based weirdness, mostly for testing.
    if(this.tooltip) {
      if(this.isMobile()) {
        this.tooltip.deactivate();
      } else {
        this.tooltip.activate();
      }
    }
  },
  onClick: function(event) {
    //Show tooltip only on mobile
    if(!this.isMobile()) {
      return;
    }

    this.refs.tooltip.show();

    event.preventDefault();
    event.stopPropagation();
  },
  render: function() {
    var className = "rxs-option-list-item",
    hoverIcon = null,
    skyLight = null;

    if(this.props.addAll) {
      className += " add-all";
    }

    if(this.props.toolTipContent && this.props.toolTipContent !== "") {
      hoverIcon = (
        <div
          className="hover-icon"
          onClick={this.onClick}
          ref={this.createTooltip}>
          i
        </div>
      );

      if(this.isMobile()) {
        skyLight = (
          <SkyLight
            ref="tooltip"
            title={this.props.tooltipTitle}>
            {this.props.toolTipContent}
          </SkyLight>
        );
      }
    }

    return (
      <div className={className}>
        <button
          className="rxs-option-button"
          onClick={this.handleClick}>
          {this.props.label}
          {hoverIcon}
        </button>
        {skyLight}
      </div>
    );
  }
});

module.exports = OptionListItem;