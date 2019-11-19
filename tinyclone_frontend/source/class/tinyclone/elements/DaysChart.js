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

    const queryString = `query GetVisitsPerDay($identifier: String!, $days: Int) {
                          link(identifier: $identifier) {
                              visitsByDate(days: $days) {
                                date
                                visits
                              }
                            }
                          }`;
    // create a model for the variables
    this.__variables = qx.data.marshal.Json.createModel({identifier: null, days: null});

    // instatiate the query object
    this.__queryObject = new qxgraphql.Query(queryString, this.__variables);
  },

  properties: {
    appearance: {
      refine: true,
      init: "days-chart"
    }
  },

  members: {
    __queryObject: null,
    __variables: null,
    
    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "label":
          control = new qx.ui.basic.Label();
          this._add(control)
          break;
        case "bar":
          control = new qx.ui.container.SlideBar();
           
          // create a button for each predefined number of days we want
          // stats for.
          [7, 14, 21, 30].forEach(function(days) {
            const button = new qx.ui.form.Button(`${days} Days`);
            button.addListener("execute", function() {
              this.setDays(days);
              this._send();
            }, this);
            control.add(button);
          }, this);

          this._add(control);
          break;
        case "chart":
          control = new tinyclone.charts.Chart();
      // dispose only the dummy wrapper which is a qooxdoo object
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

          control.setView('{"columns":[0,1,{"calc":"stringify","sourceColumn":1,"type":"string","role":"annotation","properties":{"role":"annotation"}}]}');

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
          {v: val.getVisits()}

        ]};
      });

      const columns = [
        {id: "Date", type: "string"},
        {id: "Visits", type: "number"},
      ]

      const model = {cols: columns, rows: rows}; 
      const chart = this.getChildControl("chart");
      chart.setModel(model);
      chart.draw();

      // update the label
      const label = this.getChildControl("label");
      label.setValue(this.tr("Number of visits in the past %1 days", [dateModel.length]));
    },

    setIdentifier: function(value) {
      this.__variables.setIdentifier(value);
    },

    setDays: function(value) {
      this.__variables.setDays(value);
    },

    _send: async function() {
      try {
        const result = await tinyclone.SService.getInstance().send(this.__queryObject);
        const model = qx.data.marshal.Json.createModel(result.getResponse());
        this.setModel(model);
      } catch (err) {
        console.log(err);
        this.info("Could not get query result");
      }
    }
  }
});
