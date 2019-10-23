qx.Class.define("tinyclone.SService", {
  type: "singleton",
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    this.__service = new qxgraphql.HTTP("http://localhost:4000/api/");
  },

  members: {
    __service: null,

    getService: function() {
      return this.__service;
    },

    send: function(query) {
      this.getService().send(query);
    }
  }
});
