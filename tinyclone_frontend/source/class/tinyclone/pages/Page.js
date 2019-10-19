/**
 * Pages superclass from which all the page classes
 * derive.
 *
 */
qx.Class.define("tinyclone.pages.Page", {
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
    },

    /**
     * Returns this pages container widget
     * @return {qx.ui.container.Composite} the pages content container
     */
    _getContainer: function() {
      if (this.__container === null) {
        this.__container = new qx.ui.container.Composite();
        this.__container.setAppearance("content-container");
      }
      return this.__container;
    },

    // adds the main container to the page
    __addContainer: function() {
      const container = this._getContainer();
      this.add(container);
    },

    __addSpacer: function() {
      this.add(new qx.ui.core.Spacer(), {flex: 1});
    }
  }
});
