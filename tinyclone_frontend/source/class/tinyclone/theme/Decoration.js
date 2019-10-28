/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

 ************************************************************************ */

qx.Theme.define("tinyclone.theme.Decoration",
  {
    extend : qx.theme.indigo.Decoration,

    decorations :
    {
      "infobox-success": {
        style: {
          backgroundColor: "success-background",
          color: "success-border",
          width: 1
        }
      },

      "infobox-error": {
        style: {
          backgroundColor: "error-background",
          color: "error-border",
          width: 1
        }
      }
    }
  });
