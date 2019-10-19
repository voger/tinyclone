qx.Class.define("tinyclone.pages.Shortener", {
  extend: tinyclone.pages.Page,

  construct: function() {
    this.base(arguments);
    const container = this._getContainer();

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(6);
    container.setLayout(layout);

    const formWidget = new tinyclone.elements.ShortenerForm().getWidget();
    this.__container.add(formWidget);
  }
});
