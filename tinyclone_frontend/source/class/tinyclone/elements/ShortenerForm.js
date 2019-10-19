qx.Class.define("tinyclone.elements.ShortenerForm", {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    this.init();
  },

  members: {
    __form: null,

    init: function() {
      const form = new qx.ui.form.Form();

      // create a text field for the long URL
      const urlBox = new qx.ui.form.TextField();
      urlBox.setRequired(true);
      form.add(urlBox, "Shorten this", qx.util.Validate.url(), "original", null, {"name": "original"});

      // create the action button
      const nowButton = new qx.ui.form.Button("now!");

      // create a text field for the custom identifier
      const customBox = new qx.ui.form.TextField();
      customBox.setPlaceholder("Optional");

      // TODO: replace the name with an actual url
      // TODO: replace the validator with one that rejects white space characters
      form.add(customBox, "to localhost:4000/", () => true, "custom", null, {"name": "custom"});

      // must add button last to give a chance to lines to be created
      nowButton.addListener("execute", function() {
        if (form.validate()) {
          alert("sending...");
        }
      }, this);

      form.addButton(nowButton);



      // save the form for future reference
      this.__form = form;
    },

    getWidget: function() {
      return new tinyclone.elements.ShortenerRenderer(this.__form);
    },

    destruct: function() {
      this._disposeObjects("__form");
    }
  }
});
