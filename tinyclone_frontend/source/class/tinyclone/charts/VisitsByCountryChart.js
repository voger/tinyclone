/**
 * @ignore(am4charts.LabelBullet)
 * @ignore(am4charts.ColumnSeries)
 * @ignore(am4charts.CategoryAxis)
 * @ignore(am4charts.ValueAxis)
 * @ignore(am4charts.XYChart)
 * @ignore(am4core.create)
 */
qx.Class.define("tinyclone.charts.VisitsByCountryChart", {
  extend: tinyclone.charts.BaseChart,

  members: {
    _transformData: function(data) {
      const chartData = data.map(val => ({
          country: val.getCountry() || "Unknown",
          visits: val.getVisits()
        }));

      return chartData.sort((a, b) => {
        if (a.country === "Unknown") {
          return -1;
        }

        if (b.country === "Unknown") {
          return 1;
        }

        return a.country < b.country ? 1 : -1;
      });
    },

    // runs when this widget first appears. am4charts objects
    // require a dom element when instatiated this is why we
    // instatiate them when we have one.
    _onAppear: function() {
      /* eslint-disable no-undef */
      var element = this.getContentElement().getDomElement();
      const chart = this.__chart = am4core.create(element, am4charts.XYChart);
      var font = qx.theme.manager.Font.getInstance().resolve("small");

      const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.fontSize = font.getSize();
      xAxis.renderer.labels.template.fontFamily = font.getFamily();

      const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      yAxis.dataFields.category = "country";
      yAxis.renderer.grid.template.disabled = true;
      yAxis.calculateTotals = true;
      yAxis.renderer.minGridDistance = 5;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "country";
      series.dataFields.valueX = "visits";

      const bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.label.text = "{valueX.total}";
      bullet.label.fontSize = font.getSize();
      bullet.label.fontFamily = font.getFamily();
      bullet.dy = -10;
      bullet.label.hideOversized = false;

      chart.data = this.getData();
      /* eslint-enable no-undef */
    }
  }
});
