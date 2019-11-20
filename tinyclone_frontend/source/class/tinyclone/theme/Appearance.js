/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

 ************************************************************************ */

/**
 * 
 * @asset(qx/icon/${qx.icontheme}/16/actions/window-close.png)
 */

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
          maxWidth: width,
          allowGrowX: false,
          allowShrinkX: false,
          allowStretchX: false
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
    },

    "flash": {
      style: function(states) {
        const backgroundColor = states.success ? 
          "success-background" : "error-background";

        const decorator = states.success ? 
          "flash-success" : "flash-error";

        return {
          backgroundColor: backgroundColor,
          decorator: decorator,
          padding: 3

        };
      }
    },

    "flash/captionbar": {
      style: function() {
        const height = 16;
        return {
          minHeight: height,
          maxHeight: height
        };
      }
    },

    "flash/flash-text": {
      style: function(states) {
        return {
          font: "default",
          textColor: states.success ? "success-text" : "error-text",
          padding: [4, 20, 20]
        };
      } 
    },

    "flash/close-button": {
      alias: "button",

      style: function(states) {
        const backgroundColor = states.success ? 
          "success-background" : "error-background";

        const decorator = states.success ? 
          "infobox-success" : "infobox-error";

        return {
          marginLeft : 2,
          icon : qx.theme.simple.Image.URLS["window-close"],
          padding : [ 1, 2 ],
          backgroundColor: backgroundColor,
          decorator: decorator
        };
      }

    },

    "infobox": {},

    "infobox/information": "application-name-label",

    "infobox/entry": {
      style: function() {
        return {
          font: "default"
        };
      }
    },

    "days-chart": {},

    "days-chart/label": {
      style: function() {
        return {
          font: "headline"
        };
      }
    },

    "days-chart/chart": {
      style: function() {
        return {
          minHeight: 180
        };
      }
    },

    "days-chart/bar": "slidebar" 
  }
});
