qx.Class.define("tinyclone.pages.Info", {
  extend: tinyclone.pages.Page,

  construct: function(route) {
    this.base(arguments, route);

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(18);
    layout.setAlignX("center");
    this.setLayout(layout);

    const queryString = `query GetLink($identifier: String!, $days: Int) {
                          link(identifier: $identifier) {
                            original
                            identifier
                            dateCreated
                            visitsByCountry {
                            country
                              visits
                              }
                              visits
                              visitsByDate(days: $days) {
                                date
                                visits
                              }
                            }
                          }`;


    // create a model for the variables
    var variablesModel = qx.data.marshal.Json.createModel({identifier: null, days: null});

    // bind this page's properties to the model
    this.bind("identifier", variablesModel, "identifier");
    this.bind("days", variablesModel, "days");

    // instatiate the query object
    this.__queryObject = new qxgraphql.Query(queryString, variablesModel);

    this.addListener("changeIdentifier", this._onChangeIdentifier, this);

    // add the widgets
    const infoBox = new tinyclone.elements.InfoBox();
    this.bind("model", infoBox, "model");
    this.add(infoBox, {flex: 1});

  },

  events: {
    "changeDays": "qx.event.type.Data",
    "changeModel": "qx.event.type.Data",
    "changeIdentifier": "qx.event.type.Data"
  },

  properties: {
    /**
     * The number of days to display
     */
    days: {
      check: "Integer",
      nullable: false,
      init: 20,
      event: "changeDays"
    },

    /**
     * The model that holds the data to graph
     */
    model: {
      check: "qx.core.Object",
      nullable: true,
      init: null,
      apply: "_applyModel",
      event: "changeModel"
    },

    /**
     * The link for which to display the data
     */
    identifier: {
      check: "String",
      nullable: true,
      event: "changeIdentifier",
      apply: "_applyIdentifier"
    }
  },

  members: {
    __qyeryObject: null,
    __marshaler: null,

    // override
    handleData: async function(data) {
      try {
        await tinyclone.loader.ChartLoader.getInstance().ensureLoaded();

        const chart = new tinyclone.charts.Chart();
        chart.setChartType("ColumnChart");

        chart.setModel([
          ['Germany', 'USA', 'Brazil', 'Canada', 'France', 'RU'],
          [700, 300, 400, 500, 600, 800]
        ]);
        chart.setOption("title", "Countries");

        this.add(chart);

        this.setIdentifier(data.params.link);
      } catch (err) {
        console.log(err);
        this.error("Google charts library is not loaded: ");
      }
    },

    _createInfo: function() {

    },

    _applyModel: function(val, old) {
      if(old !== null) {
        old.dispose();
      }
    },

    _applyIdentifier: function(val) {
      // this._send();
    },

    _onChangeDays: function() {

    },

    _onChangeIdentifier: function() {
      this._send();
    },

    _send: async function() {
      try {
        const result = await tinyclone.SService.getInstance().send(this.__queryObject);
        const model = qx.data.marshal.Json.createModel(result.getResponse());
        console.log(model);
        this.setModel(model);

      } catch (err) {
        console.log(err);
        this.info("Could not get query result");
      }
    }
  }
});
