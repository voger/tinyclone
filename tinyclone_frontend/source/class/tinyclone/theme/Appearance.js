/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

 ************************************************************************ */

qx.Theme.define("tinyclone.theme.Appearance", {
  extend: qx.theme.indigo.Appearance,

  appearances: {
    "form-renderer-label": {
      include: "label",
      style: function() {
        return {
          paddingTop: 3,
          font: "bold"
        };
      }
    },

    "content-container": {
      style: function() {
        // original implementation is 950px wide
        const width = 950;
        return {
          minWidth: width,
          maxWidth: width
        };
      }
    },

    "application-name-label": {
      include: "label",

      style: function() {
        return {
          font: "logo"
        };
      }
    },

    "button": {
      base: true,

      style: function() {
        return {
          margin: 5,
          padding: [2, 8]
        };
      }
    }
  }
});
