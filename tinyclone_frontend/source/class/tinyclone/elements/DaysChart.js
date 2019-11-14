qx.Class.define("tinyclone.elements.DaysChart", {
  extend: qx.ui.core.Widget,
  include : [qx.ui.core.MContentPadding],

  construct: function() {
    this.base(arguments);
    const layout = new qx.ui.layout.Grid();
    this._setLayout(layout);

    this._createChildControl("label");
    this._createChildControl("bar");
    this._createChildControl("chart");
  },

  events: {
    "changeDays": "qx.event.type.Data",
  },

  properties: {
    days: {
      nullable: true,
      check: "Integer",
      event: "changeDays"
    }
  },

  members: {
    __queryObject: null,
    __marshaler: null,

    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "label":
          control = new qx.ui.basic.Label();
          this._add(control, {row: 0, column: 0, colSpan: 2})
          break;
        case "bar":
          control = new qx.ui.container.SlideBar();
          this._add(control, {row: 1, column: 1});
          break;
        case "chart":
          control = new tinyclone.charts.Chart();
          control.setChartType("ColumnChart");

          const chartLoader = tinyclone.loader.ChartLoader.getInstance();
          chartLoader.bind("loaded", control, "wrapper", {
            converter: function(value, _model, _source, target) { 
              return value === true ? 
                new google.visualization.ChartWrapper() :
                target.getWrapper();
            }
          });

          this._add(control, {row: 2, column: 2});
          break;

      }
      return control || this.base(arguments, id);
    },

    // This is very implementation specific since it 
    // expects the incoming model to have the path 
    // "data.link.visitsByDate"
    setModel: function(value) {
      if (value === null) {
        return;
      }

      const dateModel = value.getData().getLink().getVisitsByDate().toArray();
      const rows = dateModel.map((val) => {
        return {c: [          
          {v: new Date(val.getDate())},
          {v: val.getVisits()}
        ]};
      });

      const columns = [
        {id: "Date", type: "date"},
        {id: "Visits", type: "number"}
      ]

      const model = {cols: columns, rows: rows}; 
      const chart = this.getChildControl("chart");
      chart.setModel(model);
      chart.draw();
    }
  }
});
