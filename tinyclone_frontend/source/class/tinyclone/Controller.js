qx.Class.define("tinyclone.Controller", {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    this.init();
  },

  members: {
    __pages: null,
    __container: null,

    init: function() {
      // add pages to the container
      this._addPage("shortener", new tinyclone.pages.Shortener());
    },

    getContainer: function() {
      if (this.__container === null) {
        this.__container = new qx.ui.container.Stack();
      }

      return this.__container;
    },

    _addPage: function(key, page) {
      this._getPages()[key] = page;

      const container = this.getContainer();
      container.add(page);
    },

    _getPages: function() {
      if (this.__pages === null) {
        this.__pages = {};
      }
      return this.__pages;
    }
  }
});
