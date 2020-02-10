qx.Class.define("tinyclone.SService", {
  type: "singleton",
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    const server = tinyclone.util.Server.getApiServer();
    this.__service = new qxgraphql.HTTP(server);
  },

  members: {
    __service: null,

    getService: function() {
      return this.__service;
    },

    send: function(query) {
      return this.getService().send(query);
    }
  }
});
