qx.Class.define("tinyclone.pages.Info", {
  extend: tinyclone.pages.Page,


  construct: function(route) {
    this.base(arguments, route);

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(18);
    this.setLayout(layout);
  },

  members: {
    __qyeryObject: null,
    __queryString: null,

    start: async function() {
      try {
        await tinyclone.loader.ChartLoader.getInstance().ensureLoaded();
      } catch (err) {
        this.error("Google charts library is not loaded: ");
      }
    }

  }
});
