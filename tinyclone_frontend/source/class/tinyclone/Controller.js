qx.Class.define("tinyclone.Controller", {
  extend: qx.ui.tabview.TabView,

  construct: function() {
    this.base(arguments);

    const bar = this.getChildControl("bar");
    bar.setVisibility("excluded");
  }
});
