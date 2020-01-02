qx.Class.define("tinyclone.charts.BaseChart", {
  extend: qx.ui.core.Widget,
  type: "abstract",

  /**
   * Creates a new chart
   * 
   * @param type {String} the type of the chart
   * @param is3d {Boolean} if the chart is 3D or simple 2D. Default false
   */
  construct: function(type, is3d = false) {
    this.base(arguments);

    // postpone the creation of the chart until we are ready
    this.addListenerOnce("appear", this._onAppear, this);
    this.initData([]);
  },

  properties: {
    data: {
      nullable: false,
      deferredInit: true,
      check: "Array",
      apply: "_applyData",
      transform: "_transformData"
    }
  },

  members: {
    // the chart object itself
    __chart: null,

    getChart: function() {
      return this.__chart;
    },

    _applyData: function(data) {
      if (!this.__chart) {
        return;
      }
      this.__chart.data = data;
    },

    _transformData: function(data) {
      throw new Error("Abstract method call.");
    },

    /**
     * Runs when this widget first appears. am4charts objects 
     * require a dom element when instatiated this is why we
     * instatiate them when we have one.
     */
    _onAppear: function() {
      throw new Error("Abstract method call.");
    }
  }
});
