qx.Class.define("tinyclone.loader.ChartLoader", {
  extend: qx.core.Object,
  type: "singleton",

  members: {
    __loaded: false,

    /**
     * Make sure the google charts libray is loaded
     */
    ensureLoaded: async function() {
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
          this.__loaded == true;
        } catch(err) {
          this.__loaded = false
          this.error("Failed to load google charts library.");
        }
      }
    }
  }
});
