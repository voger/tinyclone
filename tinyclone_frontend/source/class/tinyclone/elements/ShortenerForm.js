qx.Class.define("tinyclone.elements.ShortenerForm", {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    const queryString = `mutation($input: CreateLinkInput!) {
                      createLink(input: $input) {
                        link {
                          identifier
                          original
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

  events: {
    /**
     * Notifies when the request has been completed
     * and response has been received. Data is the response 
     * payload.
     *
     */
    "completed": "qx.event.type.Data"
  },

  members: {
    __form: null,
    __queryObject: null,

    init: function() {
      const form = new qx.ui.form.Form();

      // create a text field for the long URL
      const urlBox = new qx.ui.form.TextField();
      urlBox.setRequired(true);
      urlBox.setNativeContextMenu(true);
      form.add(urlBox, "Shorten this", qx.util.Validate.url(), "original", null, {"name": "original"});

      // create a text field for the custom identifier
      const customBox = new qx.ui.form.TextField();
      customBox.setPlaceholder("Optional");
      customBox.setNativeContextMenu(true);

      // TODO: replace the name with an actual url
      form.add(customBox, tinyclone.util.Server.getRedirectServer() + "/", 
        function(val) {
          if (/\s/.test(val)) {
            throw new qx.core.ValidationError("WhiteSpaceDetected", "White space characters are not allowed");
          }
        }, 
        "custom", null, {"name": "custom"});

      // create the action button
      // must add button last to give a chance to lines to be created
      const nowButton = new qx.ui.form.Button("now!");

      nowButton.addListener("execute", this.__executeNow, this);

      form.addButton(nowButton);

      // save the form for future reference
      this.__form = form;

      // bind form values to model
      const query = this._getQuery();
      const model = query.getVariables();
      const bindingOptions = {
        converter: data => data ? data : null
      };
      urlBox.bind("changeValue", model, "input.url", bindingOptions);
      customBox.bind("changeValue", model, "input.custom", bindingOptions);
    },

    _send: function(form) {
      const query = this._getQuery();
      return tinyclone.SService.getInstance().send(query);
    },

    _getQuery: function() {
      return this.__queryObject;
    },

    getWidget: function() {
      const form = this.getForm();
      return new tinyclone.elements.ShortenerRenderer(form);
    },

    getForm: function() {
      return this.__form;
    },

    __executeNow: async function() {
      const form = this.getForm();
      if (form.validate()) {
        try {
          const request = await this._send(form);
          const response = request.getResponse();
          const data = response.data.createLink;
          if (data.link !== null) {
            this.fireDataEvent("completed", data.link);
          } else {
            this.__handleErrors(data.errors);
            this.fireDataEvent("completed", data.errors);
          }
        } catch(err) {
          console.log(err);
          this.fireDataEvent("completed", err.message);
        }
      }
    },

    // sets the appropriate fields invalid with the error
    // messages. 
    //
    // ATTENTION: Empties the errors array that is returned 
    // from the query result
    __handleErrors: function(errors){
      // map error fields to form fields
      const formKeys = {
        "identifier": "custom",
        "original": "original"
      };

      // map potential messages
      const messages = {
        "badWord": "Word is not allowed",
        "alreadyTaken": "Word is already taken",
        "invalidURL": "This is not a valid URL"
      };

      while(errors.length > 0) {
        const error = errors.pop();
        const field = formKeys[error.key];

        let message = error.message;

        if (message.includes("bad word")){
          message = messages["badWord"]
        } else if (message.includes("already been taken")) {
          message = messages["alreadyTaken"]
        } else if (message.includes("is not a valid url")) {
          message = messages["invalidURL"]
        }

        const form = this.getForm();
        const errorItem = form.getItem(field);
        errorItem.setValid(false);
        errorItem.setInvalidMessage(message);
      }
    }
  },

  destruct: function() {
    this._disposeObjects(["__form", "__queryObject"]);
  }
});
