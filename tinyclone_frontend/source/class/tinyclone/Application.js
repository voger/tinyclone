/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

 ************************************************************************ */

/**
 * This is the main application class of "tinyclone"
 *
 * @asset(tinyclone/*)
 * @require(tinyclone.lang.normalize.Location)
 */
qx.Class.define("tinyclone.Application", {
  extend : qx.application.Standalone,



  /*
   *****************************************************************************
     MEMBERS
   *****************************************************************************
   */

  members : {
    __routing: null,

    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function() {
      // Call super class
      this.base(arguments);


      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // patch the history object
      qx.Class.patch(qx.bom.History, tinyclone.patch.MHistory);

      // Document is the application root
      const doc = this.getRoot();

      const controller = new tinyclone.Controller();

      // add pages to the container
      controller.add(new tinyclone.pages.Shortener(""));
      controller.add(new tinyclone.pages.Info("info"));
      doc.add(controller, {edge: 0});

      // set up routing
      const routing = this.getRouting();
      routing.onGet("/", this._selectPage, controller);
      routing.onGet("info/{link}", this._selectPage, controller);

      routing.init();
    },

    /**
     * Returns the application's routing.
     *
     * @return {qx.application.Routing} The application's routing.
     */
    getRouting: function() {
      if (!this.__routing) {
        this.__routing = new qx.application.Routing();
      }
      return this.__routing;
    },

    _selectPage: function(data) {
      // get the first parent from the data path
      const first = data.path.split("/", 1)[0];

      // gather all the children
      const children = this.getChildren();

      // find the one labeled `first`
      const page = children.find(function(child) {
        return child.getLabel() === first;
      });


      // set selection to that child
      this.setSelection([page]);
      page.handleData(data);
    }
  }
});
