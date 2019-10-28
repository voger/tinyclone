qx.Class.define("tinyclone.pages.Shortener", {
  extend: tinyclone.pages.Page,

  construct: function() {
    this.base(arguments);

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(18);
    this.setLayout(layout);

    // add the widgets
    this.__addLogo();
    const infoBox = this.__addInfobox();
    const form = this.__addForm();

    form.addListener("completed", function(e) {
      const data = e.getData();
      if (qx.lang.Type.isObject(data)) {
        const message = "%1 has been shortened to <a href=\"%2/%3\">%2/%3</a><br>Go to <a href=\"%2#info~%3\">%2#info~%3</a> to get more information about this link.";
        const formated = qx.lang.String.format(message, 
          [data.original, "http://localhost:4000", data.identifier]);

        infoBox.inform(formated, "success");
      } else {
        const message = "Could not shorten the link. Please check errors below and try again";
        infoBox.inform(message, "error");
      }
    }, this);
  },

  members: {
    // helper not to litter the constructor
    // returns the logo object
    __addLogo: function() {
      // The name of the application
      const logo = new qx.ui.basic.Label();
      logo.set({
        rich: true,
        allowGrowX: true,
        allowGrowY: true,
        appearance: "application-name-label"
      });

      const name = qx.core.Environment.get("tinyclone.name");
      logo.setValue(name);
      this.add(logo);
      return logo;
    },

    // helper not to litter the constructor
    // returns the infobox object
    __addInfobox: function() {
      const infoBox = new tinyclone.elements.InformationBox();
      this.add(infoBox);
      return infoBox;
    },


    // helper not to litter the constructor
    // returns the form object, not the renderer
    __addForm: function() {
      const form = new tinyclone.elements.ShortenerForm();
      const widget = form.getWidget();
      this.add(widget);
      return form;
    }
  }
});
