qx.Class.define("tinyclone.elements.ShortenerForm", {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    const queryString = `mutation($input: CreateLinkInput!) {
                      createLink(input: $input) {
                        link {
                          identifier
                          original
                          dateCreated     
                        }
                        errors {
                        key
                        message
                        }
                      }
                    }`;

    const modelData = {
      input: {
        url: null,
        custom: null
      }
    };

    this.__queryObject = new qxgraphql.Query(queryString, modelData);

    this.init();
  },

  members: {
    __form: null,
    __queryObject: null,

    init: function() {
      const form = new qx.ui.form.Form();

      // create a text field for the long URL
      const urlBox = new qx.ui.form.TextField();
      urlBox.setRequired(true);
      form.add(urlBox, "Shorten this", qx.util.Validate.url(), "original", null, {"name": "original"});

      // create a text field for the custom identifier
      const customBox = new qx.ui.form.TextField();
      customBox.setPlaceholder("Optional");

      // TODO: replace the name with an actual url
      // TODO: replace the validator with one that rejects white space characters
      form.add(customBox, "to localhost:4000/", 
        function(val) {
          if (/\s/.test(val) ){
            throw new qx.core.ValidationError("WhiteSpaceDetected", "White space characters are not allowed");
          }
        }, 
        "custom", null, {"name": "custom"});

      // create the action button
      // must add button last to give a chance to lines to be created
      const nowButton = new qx.ui.form.Button("now!");

      nowButton.addListener("execute", function() {
        if (form.validate()) {
          this._send(form);
        }
      }, this);

      form.addButton(nowButton);

      // save the form for future reference
      this.__form = form;


      // bind form values to model
      const query = this._getQuery();
      const model = query.getVariables();
      const bindingOptions = {
        converter: (data) => data ? data : null
      }
      urlBox.bind("changeValue", model, "input.url", bindingOptions);
      customBox.bind("changeValue", model, "input.custom", bindingOptions);
    },

    _send: function(form) {
      const query = this._getQuery();
      tinyclone.SService.getInstance().send(query);
    },

    _getQuery: function() {
      return this.__queryObject;
    },

    getWidget: function() {
      return new tinyclone.elements.ShortenerRenderer(this.__form);
    }

  },

  destruct: function() {
    this._disposeObjects(["__form", "__queryObject"]);
  }
});
