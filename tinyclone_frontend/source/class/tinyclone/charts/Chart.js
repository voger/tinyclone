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

    draw: function(element) {
      if (this.__domElement) {
        this.getWrapper().draw(this.__domElement);
      }
    },

    /**
     * Sets the DataTable for the chart. Pass in one of the following: 
     * null; a DataTable object; a JSON representation of a DataTable; 
     * or an array following the syntax of 
     * [arrayToDataTable()](https://developers.google.com/chart/interactive/docs/reference#google.visualization.arraytodatatable).
     *
     * @param table {null|various} The table object
     */
    setDataTable: function(table) {
      this.setModel(table);
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
    },

    // property apply
    _applyWrapper: function(value, old) {
      // dispose only the dummy wrapper which is a qooxdoo object
      this._disposeObjects(old);
      // if (old && old.classname === "tinyclone.charts.DummyWrapper") {
      //   old.dispose();
      // }

      //initialize the new wrapper with our properties
      value.setChartType(this.getChartType());
      value.setDataTable(this.getModel());
      value.setOptions(this.getOptions());

      this.draw();
    },

    // property apply
    _applyOptions: function(value) {
      this.getWrapper().setOptions(value);
      this.draw();
    }
  }
});
