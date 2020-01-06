qx.Mixin.define("tinyclone.patch.MHistory", {
  members: {
    // Disable URL character encoding
    // This is probably bad practice but since our characters
    // are only alphanumeric it won't do any harm.
    // This situation maybe would be best handled with subclassing
    // etc. but I really want to use patch in this project and it 
    // seems way cleaner
    _encode: function(value) {
      return qx.lang.Type.isString(value) ? value : "";
    }
  }
});
