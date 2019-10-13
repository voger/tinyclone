/* ************************************************************************

   Copyright: 2019 voger

   License: MIT license

   Authors: voger

 ************************************************************************ */

qx.Theme.define("tinyclone.theme.Appearance",
  {
    extend : qx.theme.indigo.Appearance,

    appearances : {
"form-renderer-label" : {
  include : "label",
  style : function() {
    return {
      paddingTop: 3,
      font: "bold"
    };
  }
},
}
});
