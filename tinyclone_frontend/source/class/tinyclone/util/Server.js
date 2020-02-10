/**
 * Utility class to manage various server
 * related things
 *
 */
qx.Class.define("tinyclone.util.Server", {
  extend: qx.core.Object,

  statics: {
    getRedirectServer: function() {
      return qx.core.Environment.get("tinyclone.redirectServer") ||
        window.location.origin;
    },

    getApiServer: function() {
      return qx.core.Environment.get("tinyclone.apiServer") ||
        window.location.origin + "/api"
    }
  }
});
