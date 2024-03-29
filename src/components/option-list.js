var React = require('react');
var createReactClass = require('create-react-class');
var types = require('prop-types');
var OptionListItem = require('./option-list-item');
var LazyRender = require('react-lazy-render');
var ReactSizeBox = require('react-sizebox');
var classes = require('classnames');

var OptionList = createReactClass({
  propTypes: {
    options: types.array,
    onClick: types.func,
    addAll: types.bool,
    addAllFunc: types.func,
    openTipOptions: types.object
  },
  buildOption: function (opt, index) {
    if (opt.addAll) {
      return (
        <OptionListItem
          key="Add All"
          addAll={this.props.addAll}
          onClick={this.props.addAllFunc}
          value={"Add All"}
          label="Add All"
        />
      );
    }

    var toolTipContent = '',
      toolTipTitle = '',
      label;
    if (opt.toolTipContent) toolTipContent = String(opt.toolTipContent);
    if (opt.toolTipTitle) toolTipTitle = String(opt.toolTipTitle);
    if (opt.labelComponent) label = opt.labelComponent;
    else label = opt.label;

    var className = classes({
      'rxs-item-even': index % 2 === 0,
      'rxs-item-odd': index % 2 === 1
    });

    return (
      <OptionListItem
        className={className}
        key={opt.value}
        onClick={this.props.onClick}
        value={opt.value}
        label={label}
        toolTipContent={toolTipContent}
        toolTipTitle={toolTipTitle}
        onMobileTooltip={this.props.onMobileTooltip}
        openTipOptions={this.props.openTipOptions}
      />
    );
  },
  render: function () {
    if (this.props.addAll) {
      this.props.options.unshift({ addAll: true });
    }

    return (
      <div className="content">
        <ReactSizeBox className="overflow-y rsx-SizeBox" heightProp="maxHeight">
          <LazyRender
            className="rxs-option-list rsx-lazyRender"
            generatorData={this.props.options}
            generatorFunction={this.buildOption}
            maxHeight={400}
          >
            <li>None Found</li>
          </LazyRender>
        </ReactSizeBox>
      </div>
    );
  }
});

module.exports = OptionList;
