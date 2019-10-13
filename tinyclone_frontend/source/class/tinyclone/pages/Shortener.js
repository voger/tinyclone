qx.Class.define("tinyclone.pages.Shortener", {
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base(arguments);
    this.init();
  },

  members: {
    __container: null,

    init: function() {
      const layout = new qx.ui.layout.HBox();
      this.setLayout(layout);

      // make sure the page is set up
      this.__addSpacer();
      this.__addContainer();
      this.__addSpacer();

      const formWidget = new tinyclone.elements.ShortenerForm().getWidget();
      this.__container.add(formWidget);
    },


    __getContainer: function() {
      if (this.__container === null) {
        this.__container = new qx.ui.container.Composite();
        this.__container.setLayout(new qx.ui.layout.VBox(12));
        this.__container.setWidth(950);
      }
      return this.__container;
    },

    // adds the main container to the page
    __addContainer: function() {
      const container = this.__getContainer();
      this.add(container);
    },

    __addSpacer: function() {
      this.add(new qx.ui.core.Spacer(), {flex: 1});
    }
  }
});
