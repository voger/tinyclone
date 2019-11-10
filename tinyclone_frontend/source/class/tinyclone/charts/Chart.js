qx.Class.define("tinyclone.charts.Chart", {
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base(arguments);

    this.__wrapper = new google.visualization.ChartWrapper();

    this.prepareWrapper();

    this.setHeight(400);
    this.setWidth(400);

  },

  properties: {
    model: {
      nullable: true,
      event: "changeModel",
      apply: "_applyModel",
    }
  },

  members: {
    __wrapper: null,

    /**
     * Sets chart type
     *
     * @param {String} The chart type
     *
     */
    setChartType: function(type) {
      this.getWrapper().setChartType(type);
    },

    /** 
     * Sets a single chart option value, where key is the option name 
     * and value is the value. To unset an option, pass in null for the value. 
     * Note that key may be a qualified name, such as 'vAxis.title'.
     *
     * @param key {String} The option name
     * @param value {String} The option value
     *
     */
    setOption: function(key, value) {
      this.getWrapper().setOption(key, value);
    },

    /**
     * Sets a complete options object for a chart.
     *
     * @param options {Object} An object with the set of options
     */
    setOptions: function(options) {
      this.getWrapper().setOptions(options);
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
      this.getWrapper().setDataTable(table);
    },

    prepareWrapper: function() {
      this.addListenerOnce("appear", this._onAppear, this);
    },

    getWrapper: function() {
      return this.__wrapper;
    },

    _onAppear: function() {
      const wrapper = this.getWrapper();
      const element = this.getContentElement().getDomElement();
      wrapper.draw(element);
    },

    // property apply
    _applyModel: function(value, old) {
      if(old !== null) {
        old.dispose();
      }
      this.setDataTable(value);
    }
  }
});
