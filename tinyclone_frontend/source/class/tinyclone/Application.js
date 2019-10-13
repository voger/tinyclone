/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

************************************************************************ */

/**
 * This is the main application class of "tinyclone"
 *
 * @asset(tinyclone/*)
 */
qx.Class.define("tinyclone.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
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


      // Document is the application root
      const doc = this.getRoot();

      const controller = new tinyclone.Controller();
      const mainPage = controller.getContainer();
      doc.add(mainPage, {edge: 0});
    }
  }
});
