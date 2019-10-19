qx.Class.define("tinyclone.Controller", {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
        this.__pages = {};
        this.__container = new qx.ui.container.Stack();
  },

  members: {
    __pages: null,

    // main container that holds the pages
    __container: null,

    init: function() {
    },

    getContainer: function() {
      return this.__container;
    },

    /**
     * Adds a new page to the pages controller
     * @param key {String} The key that identifies the page
     * @param page {tinyclone.pages.Page} The page to add
     *
     */
    addPage: function(key, page) {
      this.getPages()[key] = page;

      const container = this.getContainer();
      container.add(page);
    },

    getPages: function() {
      if (this.__pages === null) {
      }
      return this.__pages;
    }
  }
});
