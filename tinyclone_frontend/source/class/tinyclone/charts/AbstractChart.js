/**
 * Abstract chart for the various chart types returned by google chart
 *
 */
qx.Class.define("tinyclone.charts.AbstractChart.js", {
  extend: qx.ui.container.Composite,
  include: [qx.ui.form.MModelProperty],
  type: "abstract",


  construct: function() {
    this.base(arguments);

    google.charts.load('current');
    google.charts.setOnLoadCallback(this._prepareWrapper.bind(this));

    this.addListenerOnce("loaded", this._onLoaded, this);
    this.setHeight(400);
    this.setWidth(400);

  },

  events: {
    /**
     * Fired when the `google.visualization.ChartWrapper` object
     * is instatiated. Data contains that object.
     *
     */
    "loaded": "qx.event.type.Data"
  },

  members: {
    __wrapper: null,

    /**
     * @abstract
     * @throws {qx.type.BaseError} The abstract method call error
     *
     */
    getChartType: function() {
      throw new qx.type.BaseError("AbstractMethodCall", "getChartType is abstract method");
    },

    _prepareWrapper: function() {
      const wrapper = this.__wrapper = new google.visualization.ChartWrapper();
      wrapper.setChartType("ColumnChart");
      wrapper.setDataTable([
        ['Germany', 'USA', 'Brazil', 'Canada', 'France', 'RU'],
        [700, 300, 400, 500, 600, 800]
      ]);
      wrapper.setOption("title", "Countries");
      this.fireDataEvent("loaded", wrapper);
    },

    getWrapper: function() {
      return this.__wrapper;
    },

    _onLoaded: function() {
      const wrapper = this.getWrapper();
      const element = this.getContentElement().getDomElement();
      wrapper.draw(element);
    }
  }
});
