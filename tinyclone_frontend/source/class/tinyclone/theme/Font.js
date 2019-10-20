/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

 ************************************************************************ */

/**
 * @asset(qx/decoration/Indigo/font/JosefinSlab-SemiBold.woff)
 * @asset(qx/decoration/Indigo/font/JosefinSlab-SemiBold.ttf)
 *
 */
qx.Theme.define("tinyclone.theme.Font",
  {
    fonts :
    {
      "default" :
      {
        size : 13,
        family : ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
        color: "font",
        lineHeight: 1.8
      },

      "bold" :
      {
        size : 13,
        family : ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
        bold : true,
        color: "font",
        lineHeight: 1.8
      },

      "headline" :
      {
        size : 22,
        family : ["serif"],
        sources:
        [
          {
            family : "JosefinSlab",
            source: [
              "qx/decoration/Indigo/font/JosefinSlab-SemiBold.woff",
              "qx/decoration/Indigo/font/JosefinSlab-SemiBold.ttf"
            ]
          }
        ]
      },

      "logo": {
        size: 36,
        color: "font",
        // family : ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
        family: ["Helvetica Neue", "Arial", "Helvetica", "sans-serif"],
        bold: false,
        lineHeight: 1.8
      },

      "small" :
      {
        size : 11,
        family : ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
        color: "font",
        lineHeight: 1.8
      },

      "monospace" :
      {
        size : 11,
        family : [ "DejaVu Sans Mono", "Courier New", "monospace" ],
        color: "font",
        lineHeight: 1.8
      }
    }
  });
