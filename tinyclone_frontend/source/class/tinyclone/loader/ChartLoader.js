qx.Class.define("tinyclone.loader.ChartLoader", {
  extend: qx.core.Object,
  type: "singleton",

  properties: {
    /**
     * null or a promise returning the google
     * charting library
     *
     */
    gChart: {
      nullable: true,
      // check: "qx.core.Promise"
    },
  },

  members: {
    __dynloader: null,
    __chartUri: "https://www.gstatic.com/charts/loader.js",

    /**
     * Returns a qx.Promise that informs if the library is loaded
     */
    ensureLoaded: function() {
      if (this.getGChart() === null) {
        let chartPromise = this._getDynloader().start()
          .then(result => {
            this.debug("Successfuly loaded google charts library");
            return result;
          });
        this.setGChart(chartPromise);

        // Remove cached loginPromise when a failure occurs to allow retry
        chartPromise.catch((error) => {
          this.setGChart(null);
          this.error("Failed to load google charts library:", error);
        })
      }

      return this.getGChart()
    },

    _getDynloader: function() {
      if (this.__dynloader === null) {
        this.__dynloader = new qx.util.DynamicScriptLoader(this.__chartUri);
      }
      return this.__dynloader;
    }
  }

});
