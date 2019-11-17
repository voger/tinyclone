qx.Class.define("tinyclone.elements.DaysChart", {
  extend: qx.ui.core.Widget,
  include : [qx.ui.core.MContentPadding],

  construct: function() {
    this.base(arguments);
    const layout = new qx.ui.layout.VBox();
    this._setLayout(layout);

    this._createChildControl("label");
    this._createChildControl("bar");
    this._createChildControl("chart");
  },

  events: {
    "changeDays": "qx.event.type.Data",
  },

  properties: {

    appearance: {
      refine: true,
      init: "chart"
    },

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
          control = new qx.ui.basic.Label("Number of visits in the past 30 days");
          this._add(control)
          break;
        case "bar":
          control = new qx.ui.container.SlideBar();
          this._add(control);
          break;
        case "chart":
          control = new tinyclone.charts.Chart();
          control.setChartType("ColumnChart");

          control.setOptions({
            reverseCategories: false,
            legend: {
              position: "none"
            },
            chartArea: {
              left: 20,
              width: "70%",
            },
            hAxis: {
              showTextEvery: 1,
              slantedText: true,
              direction: "-1",
              textStyle: {
                fontSize: 11
              }
            },
            vAxis: {
              textPosition: "none",
              gridlines: {
                count: 0
              }
            },
            tooltip: {
              trigger: "none"
            }
          });


          const chartLoader = tinyclone.loader.ChartLoader.getInstance();
          chartLoader.bind("loaded", control, "wrapper", {
            converter: function(value, _model, _source, target) { 
              return value === true ? 
                new google.visualization.ChartWrapper() :
                target.getWrapper();
            }
          });

          this._add(control, {flex: 1});
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
      const formatter = new qx.util.format.DateFormat("dd/MM");
      const rows = dateModel.map((val) => {
        const date = new Date(val.getDate());
        return {c: [          
          {v: date, f: formatter.format(date)},
          {v: val.getVisits()},
          {v: val.getVisits()}

        ]};
      });

      const columns = [
        {id: "Date", type: "string"},
        {id: "Visits", type: "number"},
        {id: "annotations", type: "string", role: "annotation"}
      ]

      const model = {cols: columns, rows: rows}; 
      const chart = this.getChildControl("chart");
      chart.setModel(model);
      chart.draw();
    }
  }
});
