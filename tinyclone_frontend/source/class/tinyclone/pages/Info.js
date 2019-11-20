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
    // we need 30 days of data
    variablesModel.setDays(30);

    // instatiate the query object
    this.__queryObject = new qxgraphql.Query(queryString, variablesModel);

    this.addListener("changeIdentifier", this._onChangeIdentifier, this);

    // add the widgets
    const infoBox = new tinyclone.elements.InfoBox();
    this.bind("model", infoBox, "model");
    this.add(infoBox);

    const daysChart = new tinyclone.elements.DaysChart();
    this.bind("model", daysChart, "model");
    this.bind("identifier", daysChart, "identifier");
    this.add(daysChart);
  },

  events: {
    "changeModel": "qx.event.type.Data",
    "changeIdentifier": "qx.event.type.Data"
  },

  properties: {
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
      event: "changeIdentifier"
    }
  },

  members: {
    __qyeryObject: null,

    // override
    handleData: async function(data) {
      this.setIdentifier(data.params.link);
    },

    _applyModel: function(val, old) {
      if(old !== null) {
        old.dispose();
      }
    },

    _onChangeIdentifier: function() {
      this._send();
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
