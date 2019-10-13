/**
 * Custom renderer for the tinyclone renderer form
 *
 */
qx.Class.define("tinyclone.elements.ShortenerRenderer", {
  extend: qx.ui.form.renderer.AbstractRenderer,

  construct: function(form) {
    const layout = new qx.ui.layout.Dock();
    this._setLayout(layout);

    this.__linePositions = {
      "original": "north",
      "custom": "south"
    };

    this.base(arguments, form);
  },

  members: {
    __linePositions: null,

    /**
     * Highly customized renderer for this specific application.
     * Tightly coupled and makes assumtions about the names of the items
     * in the form. 
     *
     * @param items {qx.ui.core.Widget[]} An array of form items to render.
     * @param names {String[]} An array of names for the form items.
     *
     */
    addItems(items, names, label, options) {
      for (let i = 0; i < items.length; i++) {
        const position = this.__linePositions[options[i].name];

        const needsSuffix = !(position == "south");

        const label = this._createLabel(names[i], items[i], needsSuffix);
        const item = items[i];
        label.setBuddy(item);
        this._connectVisibility(item, label);

        // create a line container
        const line = new qx.ui.container.Composite();
        const layout = new qx.ui.layout.HBox();
        layout.setAlignY("middle");

        line.setLayout(layout);
        line.add(label);

        // if we are dealing with the second row of the form
        if (position == "south") {
        
          line.add(item, {width: "30%"});
          line.add(new qx.ui.core.Spacer(), {flex: 5});
        } else if (position == "north") {
          line.add(item, {width: "70%"});
        }

        this._add(line, {edge: position});
      }
    },

    addButton: function(button) {
      const children = this._getChildren();

      // ensure the first row exists
      if (children.length == 0) {
        throw new qx.type.BaseError("NoFormRows", "It seems your form has no rows." + 
          " Please call this method after adding the other fields.");
      }

      const firstRow = children[0];
      firstRow.add(button);
    },

    /**
     * Creates a label for the given form item.
     *
     * @param name {String} The content of the label without the
     *   trailing * and :
     * @param item {qx.ui.core.Widget} The item, which has the required state.
     * @param suffix {Boolean} If should include the label suffix. Default true
     * @return {qx.ui.basic.Label} The label for the given item.
     */
    _createLabel : function(name, item, suffix = true) {
      var label = new qx.ui.basic.Label(this._createLabelText(name, item, suffix));
      // store labels for disposal
      this._labels.push(label);
      label.setRich(true);
      label.setAppearance("form-renderer-label");
      return label;
    },


 /**
     * Creates the label text for the given form item.
     *
     * @param name {String} The content of the label without the
     *   trailing * and :
     * @param item {qx.ui.form.IForm} The item, which has the required state.
     * @param suffix {Boolean} If should include the label suffix. Default true
     * @return {String} The text for the given item.
     */
    _createLabelText : function(name, item, suffix = true)
    {
      var requiredSuffix = "";
      if (item.getRequired()) {
        requiredSuffix = this.getRequiredSuffix();
      }

      // Create the label. Append a suffix only if there's text to display.
      var labelSuffix = suffix && (name.length > 0 || item.getRequired()) ? this.getLabelSuffix() : "";
      return name + requiredSuffix + labelSuffix;
    },
  }
});
