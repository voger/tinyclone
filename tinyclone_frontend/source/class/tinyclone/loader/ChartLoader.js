qx.Class.define("tinyclone.loader.ChartLoader", {
  extend: qx.core.Object,
  type: "singleton",

  properties: {
    loaded: {
      nullable: false,
      init: false,
      event: "changeLoaded"
    }
  },

  events: {
    "changeLoaded" : "qx.event.type.Data"
  },

  members: {

    /**
     * Make sure the google charts libray is loaded
     */
    start: async function() {
      if (!this.__loaded){
        try {
          // first we load the google loaders
          const loaders = [
            "https://www.gstatic.com/charts/loader.js",
            // "https://www.google.com/jsapi"
          ];
          await new qx.util.DynamicScriptLoader(loaders).start();

          // then we load the packages
          await new qx.Promise((resolve) => {
            google.charts.load("current", 
              {
                packages: ["corechart"], 
                callback: resolve
              });
          });
          this.debug("Successfuly loaded google charts library");
          this.setLoaded(true);
        } catch(err) {
          console.log(err);
          this.setLoaded(false);
          this.error("Failed to load google charts library.");
        } 
      }
    }
  }
});
