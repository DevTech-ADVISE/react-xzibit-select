var IsMobileMixin = {
  isMobile: function() {
    return this.state._mobile.width <= 740;
  },

  getInitialState: function() {
    return {
      _mobile: {
        width: window.innerWidth
      }
    };
  },

  componentDidMount: function() {
    if(window.addEventListener) {
      window.addEventListener('resize', this._onResize);
    } else if (window.attachEvent) {
      window.attachEvent('onresize', this._onResize);
    } else {
      window.onresize = this._onResize;
    }
  },

  _onResize: function() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._updateSize, 16);
  },

  _updateSize: function() {
    this.setState({
      _mobile: {
        width: window.innerWidth
      }
    });
  }
};

module.exports = IsMobileMixin;