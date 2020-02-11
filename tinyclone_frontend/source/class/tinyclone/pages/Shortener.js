/**
 * @ignore(showInfo)
 *
 */
qx.Class.define("tinyclone.pages.Shortener", {
  extend: tinyclone.pages.Page,

  construct: function(route) {
    this.base(arguments, route);

    // used for when we have a shortened link and we want 
    // the show the info page
    window.showInfo = function({href}) {
      const application = qx.core.Init.getApplication();
      const routing = application.getRouting();
      const hash = href.split("#")[1];
      routing.executeGet(hash);
    };

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(18);
    this.setLayout(layout);

    // add the widgets
    this.__addLogo();
    const flash = this.__addFlash();
    const form = this.__addForm();

    form.addListener("completed", function(e) {
      const data = e.getData();
      if (qx.lang.Type.isObject(data)) {
        const identifier = data.identifier;

        // eslint-disable-next-line quotes 
        const message = '%1 has been shortened to <a href="%2">%2</a><br>Go to <a href="%3" onClick="showInfo(this); return false">%3</a> to get more information about this link.';
        const formated = qx.lang.String.format(message, 
          [
            data.original, 
            `${tinyclone.util.Server.getRedirectServer()}/${identifier}`,
            `${window.location.origin}/#info/${identifier}`
          ]);

        flash.inform(formated, "success");
      } else {
        const message = "Could not shorten the link. Please check errors below and try again";
        flash.inform(message, "error");
      }
    }, this);

    form.addListener("error", function(e) {
      const message = "There was an error connecting with the shortener service. Please try again later.";
      flash.inform(message, "error");
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
    __addFlash: function() {
      const flash = new tinyclone.elements.Flash();
      this.add(flash);
      return flash;
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
