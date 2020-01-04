qx.Class.define("tinyclone.ScriptLoader", {
  extend: qx.core.Object,
  type: "singleton",

  properties: {

    loaded: {
      init: false,
      nullable: false,
      check: "Boolean"
    }
  },

  members: {
    libray: "js/amcharts/amcharts.js",

    load: async function() {
      if (this.isLoaded()) {
        return true;
      }

      try {
        await new qx.util.DynamicScriptLoader([this.libray]).start()
      } catch (err) {
        this.error("Failed loading the charting library.")
        this.error(err);
      }
    }
  }
});
