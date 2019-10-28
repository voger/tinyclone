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


  construct: function() {
    this.base(arguments);
    this._setLayout(new qx.ui.layout.Dock());

    this._createChildControl("footer");
  },

  members: {
    // overridden
    getChildrenContainer : function() {
      return this.getChildControl("content");
    },

    // overridden
    _createChildControlImpl : function(id, hash) {
      var control;

      switch (id) {
        case "content":
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

          this._add(container, {edge: "north"});
          break;
        case "footer":
          control = new qx.ui.basic.Label();
          control.setValue("Copyright © goes here");
          control.setRich(true);
          this._add(control, {edge: "south"});
          break;
      }

      return control || this.base(arguments, id);
    }
  }
});
