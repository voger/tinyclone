qx.Class.define("tinyclone.loader.ChartLoader", {
  extend: qx.core.Object,
  type: "singleton",

  members: {
    __dynloader: null,
    __chartUri: "https://www.gstatic.com/charts/loader.js",
    __loaded: false,

    /**
     * Make sure the google charts libray is loaded
     */
    ensureLoaded: async function() {
      if (!this.__loaded){
        try {
          let chartPromise = await this._getDynloader().start();
          this.debug("Successfuly loaded google charts library");
          this.__loaded == true;
        } catch(err) {
          this.__loaded = false
          this.error("Failed to load google charts library.");
        }
      }
    },

    _getDynloader: function() {
      if (this.__dynloader === null) {
        this.__dynloader = new qx.util.DynamicScriptLoader(this.__chartUri);
      }
      return this.__dynloader;
    }
  }
});
