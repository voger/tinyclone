qx.Class.define("tinyclone.pages.Shortener", {
  extend: tinyclone.pages.Page,

  construct: function() {
    this.base(arguments);

    // container has no layout. Add one
    const layout = new qx.ui.layout.VBox(18);
    this.setLayout(layout);

    // The name of the application
    const logo = new qx.ui.basic.Label();
    logo.set({
      rich: true,
      allowGrowX: true,
      allowGrowY: true,
      appearance: "application-name-label"
    });

    // TODO: This must come from an env value or something
    const name = "TinyClone";
    logo.setValue(name);
    this.add(logo);


    const formWidget = new tinyclone.elements.ShortenerForm().getWidget();
    this.add(formWidget);
  }
});
