var React = require('react');
var createReactClass = require('create-react-class');
var Opentip = require('opentip');
var classes = require('classnames');
var IsMobileMixin = require('react-ismobile-mixin');
require('opentip/css/opentip.css');

var OptionListItem = createReactClass({
  // propTypes: {
  //   label: types.any,
  //   value: types.any,
  //   onClick: types.func,
  //   addAll: types.bool,
  //   toolTipContent: types.string,
  //   toolTipTitle: types.string,
  //   openTipOptions: types.object
  // },
  mixins: [IsMobileMixin],
  handleClick: function(){
    this.props.onClick(this.props.value);
  },
  createTooltip: function(component) {
    if(component === null || this.tooltip || this.isMobile()) {
      return;
    }
    this.tooltip = new Opentip(component, this.props.toolTipContent, this.props.toolTipTitle, this.props.openTipOptions);
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
  openSkylight: function(event) {
    //Show tooltip only on mobile
    if(!this.isMobile()) {
      return;
    }

    var tooltip = (<div dangerouslySetInnerHTML={{__html: this.props.toolTipContent}} />);

    this.props.onMobileTooltip(this.props.title, tooltip);

    event.preventDefault();
    event.stopPropagation();
  },
  render: function() {
    var hoverIcon = null;

    if(this.props.toolTipContent && this.props.toolTipContent !== '') {
      hoverIcon = (
        <div
          className='hover-icon'
          onTouchStart={this.openSkylight}
          ref={this.createTooltip}>
          i
        </div>
      );
    }

    var className = classes('rxs-option-list-item', this.props.className, {'add-all': this.props.addAll});

    return (
      <div className={className}>
        <div className='rxs-option-button'>
          <div
            role='button'
            className='rxs-option-button-click'
            tabIndex='0'
            onClick={this.handleClick}>
            {this.props.label}
          </div>
          {hoverIcon}
        </div>
      </div>
    );
  }
});

module.exports = OptionListItem;
