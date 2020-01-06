qx.Class.define("tinyclone.elements.CountriesChart", {
  extend: qx.ui.core.Widget,
  include : [qx.ui.core.MContentPadding],

  construct: function() {
    this.base(arguments);
    const layout = new qx.ui.layout.Grid();
    this._setLayout(layout);

    this._createChildControl("label");
    this._createChildControl("bar");
    // this._createChildControl("map-chart");
    this._createChildControl("bar-chart");

    const queryString = `query GetVisitsByCountry($identifier: String!) {
                          link(identifier: $identifier) {
                            visitsByCountry {
                              country
                              visits
                            }
                          }
                        }`;
    // create a model for the variables
    this.__variables = qx.data.marshal.Json.createModel({identifier: null});

    // instatiate the query object
    this.__queryObject = new qxgraphql.Query(queryString, this.__variables);
  },

  properties: {
    appearance: {
      refine: true,
      init: "countries-chart"
    }
  },

  members: {
    __queryObject: null,
    __variables: null,

    setModel: function(value) {
      if (value === null) {
        return;
      }

      const data = value.getData().getLink().getVisitsByCountry().toArray();
      this.getChildControl("bar-chart").setData(data);
    },

    setIdentifier: function(value) {
      this.__variables.setIdentifier(value);
    },

    // overridden
    _createChildControlImpl : function(id, hash) {
      var control;

      switch (id) {
        case "label":
          // eslint-disable-next-line no-case-declarations
          const label = this.tr("Number of visits by country");
          control = new qx.ui.basic.Label(label);
          control.setRich(true);
          this._add(control, {row: 0, column: 0, colSpan: 2});
          break;
        case "bar":
          control = new qx.ui.container.SlideBar();

          this._add(control, {row: 1, column: 1, colSpan: 2});
          break;
        case "bar-chart":
          control = new tinyclone.charts.VisitsByCountryChart();

          this._add(control, {row: 2, column: 1, colSpan: 1});
          break;
      }
      return control || this.base(arguments, id);
    }
  }

});
