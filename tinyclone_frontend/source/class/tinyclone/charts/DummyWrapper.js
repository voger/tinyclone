/**
 * Dummy class to be used as place holder until
 * the real ChartWrapper is loaded from the google
 * library. 
 *
 */
qx.Class.define("tinyclone.charts.DummyWrapper", {
  extend: qx.core.Object,


  members: {
    setChartType: function(type) {
      this.debug("Dummy chart implementation.");
    },

    setOption: function(key, value) {
      this.debug("Dummy chart implementation.");
    },

    setOptions: function(options) {
      this.debug("Dummy chart implementation.");
    },

    setDataTable: function(table) {
      this.debug("Dummy chart implementation.");
    },

    setView: function(view) {
      this.debug("Dummy chart implementation.");
    },

    draw: function(element) {
      const image = document.createElement("IMG");
      image.src = qx.ui.basic.Image.PLACEHOLDER_IMAGE;
      element.appendChild(image);
    }
  }
});
