/**
 * Pages superclass from which all the page classes
 * derive.
 *
 */
qx.Class.define("tinyclone.pages.Page", {
  extend: qx.ui.tabview.Page,
  include: [
    qx.ui.core.MRemoteChildrenHandling,
    qx.ui.core.MRemoteLayoutHandling
  ],

  /**
   * Creates a new Page. 
   * @param route {String} The route that this page will be accessed
   *
   */
  construct: function(route) {
    this.base(arguments, route);

    this._setLayout(new qx.ui.layout.VBox());
    this._createChildControl("content");
    this._createChildControl("footer");
  },

  members: {
    // overridden
    getChildrenContainer : function() {
      return this.getChildControl("content");
    },

    /**
     * Is intended to be overriden by sublcasses but this is not mandatory
     * Handles passed data as each subclass sees fit. 
     *
     */
    handleData: function(data) {
      return;
    },

    // overridden
    _createChildControlImpl : function(id, hash) {
      var control;

      switch (id) {
        case "content":
          // the container that hosts the content
          control = new qx.ui.container.Composite();
          control.setAppearance("content-container");

          var container = new qx.ui.container.Composite();
          var layout = new qx.ui.layout.HBox();
          layout.setAlignX("center");
          layout.setAlignY("middle");
          container.setLayout(layout);

          container.add(new qx.ui.core.Spacer(), {flex: 1});
          container.add(control);
          container.add(new qx.ui.core.Spacer(), {flex: 1});

          // create the scroll container
          var scroll = new qx.ui.container.Scroll();
          scroll.add(container);
          this._add(scroll, {flex: 1});
          break;
        case "footer":
          control = new qx.ui.basic.Label();
          control.setValue("Copyright © goes here");
          control.setRich(true);
          this._add(control);
          break;
      }

      return control || this.base(arguments, id);
    }
  }
});
