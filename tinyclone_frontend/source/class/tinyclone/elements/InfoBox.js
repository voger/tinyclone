qx.Class.define("tinyclone.elements.InfoBox", {
  extend: qx.ui.core.Widget,

  construct: function() {
    this.base(arguments);

    const layout = new qx.ui.layout.Grid(10);
    layout.setColumnFlex(1, 1);
    layout.setColumnAlign(0, "left", "top");
    layout.setColumnAlign(1, "left", "middle");
    this._setLayout(layout);

    // initialize the controller
    this.__controller = new qx.data.controller.Object();

    this._createChildControl("information");
    this._createChildControl("original");
    this._createChildControl("shortened");
    this._createChildControl("dateCreated");
    this._createChildControl("visits");
  },

  properties: {
    // override
    appearance: {
      refine: true,
      init: "infobox"
    }
  },

  members: {
    __controller: null,

    _createChildControlImpl: function(id) {
      var control;
      let label;
      const controller = this.getController();

      switch (id) {
        case "information":
          control = new qx.ui.basic.Label("Information");
          control.setRich(true);
          this._add(control, {row: 0, column: 0, colSpan: 2});
          break;
        case "original":
          label = new qx.ui.basic.Label("Original:");
          control = new qx.ui.basic.Label();
          control.setRich(true);

          controller.addTarget(control, "value", "data.link.original", false);
          control.set({
            rich: true,
            breakWithinWords: true,
            nativeContextMenu: true,
            selectable: true,
            allowGrowX: true,
            allowGrowY: true
          });
          this._add(label, {row: 1, column: 0});
          this._add(control, {row: 1, column: 1});
          break;
        case "shortened":
          label = new qx.ui.basic.Label("Shortened:");
          control = new qx.ui.basic.Label();
          control.setRich(true);

          // eslint-disable-next-line no-case-declarations
          const server = qx.core.Environment.get("tinyclone.redirectServer");

          var model2control = {
            converter: data =>
            qx.lang.String.format("<a href=\"%1%2\">%2</a>", [server, data])
          };

          controller.addTarget(control, "value", "data.link.identifier", false, model2control);
          this._add(label, {row: 2, column: 0});
          this._add(control, {row: 2, column: 1});
          break;
        case "dateCreated":
          label = new qx.ui.basic.Label("Date Created:");
          control = new qx.ui.basic.Label();
          control.setRich(true);

          controller.addTarget(control, "value", "data.link.dateCreated", false);
          this._add(label, {row: 3, column: 0});
          this._add(control, {row: 3, column: 1});
          break;
        case "visits":
          label = new qx.ui.basic.Label("Number of visits:");
          control = new qx.ui.basic.Label();
          control.setRich(true);

           model2control = {
            converter: data =>
            qx.lang.String.format("%1 %2",
              [data, data === 1 ? "visit" : "visits"])
          };

          controller.addTarget(control, "value", "data.link.visits", false, model2control);
          this._add(label, {row: 4, column: 0});
          this._add(control, {row: 4, column: 1});
          break;
      }
      return control || this.base(arguments, id);
    },

    getController: function() {
      return this.__controller;
    },

    setModel: function(value) {
      this.getController().setModel(value);
    }
  }
});
