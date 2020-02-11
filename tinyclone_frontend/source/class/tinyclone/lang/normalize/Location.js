/**
 * Custom class for normalizing the `window.location.origin` property
 * While this property is avaliable in most of the browsers, it's 
 * availability involves some asterisks. This class modifies the property
 * for all the browsers.
 *
 */
qx.Bootstrap.define("tinyclone.lang.normalize.Location", {

  statics: {
    origin: function() {
      const {protocol, hostname, port} = window.location;
      const colon = port ? ":" : "";
      return `${protocol}//${hostname}${colon}${port}`;
    }
  },

  defer: function(statics) {
    if (!window.location.origin) {
      Object.defineProperty(window.location, "origin", {
        get: statics.origin
      });
    }
  }
});
