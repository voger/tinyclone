qx.Class.define("tinyclone.charts.Chart", {
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base(arguments);

    this.initWrapper(new tinyclone.charts.DummyWrapper());
    this.addListenerOnce("appear", this._onAppear, this);
  },

  properties: {
    /**
     * The data table for the google charts object
     *
     */
    model: {
      nullable: true,
      event: "changeModel",
      apply: "_applyModel",
    },

    /**
     * The chart wrapper. Can be either a google.vizualization.ChartWrapper
     * or a tinyclone.charts.DummyWrapper
     * 
     */
    wrapper: {
      check: "Object",
      nullable: false,
      deferredInit: true,
      apply: "_applyWrapper"
    },

    chartType: {
      check: "String",
      nullable: true,
      apply: "_applyChartType"
    },

    /**
     * The google charts options object
     *
     */
    options: {
      check: "Object",
      nullable: true,
      apply: "_applyOptions"
    }
  },

  members: {
    __wrapper: null,

    // the element in which to draw the chart
    __domElement: null,

    // the dataviewer string for the datawrapper
    __view: null, 

    draw: function(element) {
      if (this.__domElement) {
        this.getWrapper().draw(this.__domElement);
      }
    },

    setView: function(view) {
      this.__view = view;
      this.getWrapper().setView(this.__view);
    },

    _onAppear: function() {
      // const wrapper = await this.getWrapper();
      const element = this.getContentElement().getDomElement();
      this.__domElement = element;
      this.draw();
    },

    // property apply
    _applyChartType: function(value) {
      this.getWrapper().setChartType(value);
      this.draw();
    },

    // property apply
    _applyModel: function(value) {
      this.getWrapper().setDataTable(value);
      this.draw();
    },

    // property apply
    _applyWrapper: function(value, old) {
      this._disposeObjects(old);

      //initialize the new wrapper with our properties
      value.setChartType(this.getChartType());
      value.setDataTable(this.getModel());
      value.setOptions(this.getOptions());
      value.setView(this.__view);

      this.draw();
    },

    // property apply
    _applyOptions: function(value) {
      this.getWrapper().setOptions(value);
      this.draw();
    }
  }
});
