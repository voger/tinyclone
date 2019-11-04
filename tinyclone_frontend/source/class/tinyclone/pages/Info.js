qx.Class.define("tinyclone.pages.Info", {
  extend: tinyclone.pages.Page,

  construct: function(route) {
    this.base(arguments, route);

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(18);
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

    // instatiate the marshaler
    this.__marshaler = new qx.data.marshal.Json();

    this.addListener("changeIdentifier", this._onChangeIdentifier, this);
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
        this.setIdentifier(data.params.link);
      } catch (err) {
        console.log(err);
        this.error("Google charts library is not loaded: ");
      }
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
        console.log(result);

      } catch (err) {
        console.log(err);
        this.info("Could not get query result");
      }
    }
  }
});
