/* eslint-disable no-case-declarations */
qx.Class.define("tinyclone.elements.Flash", {
  extend: qx.ui.core.Widget,

  include: [
    qx.ui.core.MContentPadding
  ],

  construct: function() {
    this.base(arguments);

    // configure internal layout
    this._setLayout(new qx.ui.layout.VBox());

    // force creation of captionbar
    this._createChildControl("captionbar");
    this._createChildControl("close-button");
    this._createChildControl("flash-text");
  },

  properties: {
    // overridden
    appearance :
    {
      refine : true,
      init : "flash"
    },

    // overridden
    visibility :
    {
      refine : true,
      init : "excluded"
    },

    status: {
      check: ["success", "error"],
      nullable: true,
      apply: "_applyStatus"
    },

    message: {
      check: "String",
      nullable: true,
      apply: "_applyMessage"
    }
  },


  members: {

    // overridden
    /**
     * @lint ignoreReferenceField(_forwardStates)
     */
    // eslint-disable-next-line @qooxdoo/qx/no-refs-in-members
    _forwardStates: {
      success: true,
      error: true
    },

    /**
     * Sets the information message, sets the status
     * and makes the information box visible
     * @param message {String} The information message
     * @param status {String} One of "success", "error"
     */
    inform: function(message, status) {
      this.setMessage(message);
      this.setStatus(status);
      this.show();
    },

    // overridden
    _createChildControlImpl : function(id, hash) {
      var control;

      switch (id) {
        case "flash-text":
          control = new qx.ui.basic.Label();
          control.set({
            rich: true,
            allowGrowX: true,
            allowGrowY: true
          });
          this._add(control, {flex: 1});
          break;

        case "captionbar":
          // captionbar
          var layout = new qx.ui.layout.HBox();
          control = new qx.ui.container.Composite(layout);
          const spacer = new qx.ui.core.Spacer();
          control.add(spacer, {flex: 1});

          this._add(control);
          break;

        case "close-button":
          control = new qx.ui.form.Button();
          control.setFocusable(false);
          control.addListener("execute", this._onCloseButtonTap, this);

          this.getChildControl("captionbar").add(control);
          break;
      }

      return control || this.base(arguments, id);
    },

    _onCloseButtonTap: function() {
      this.exclude();
    },

    _applyStatus: function(value, old) {
      this.replaceState(old, value);
    },

    _applyMessage: function(value) {
      const infoText = this.getChildControl("flash-text");
      infoText.setValue(value);
    }
  }
});
