/**
 * @ignore(am4charts.LabelBullet)
 * @ignore(am4charts.ColumnSeries)
 * @ignore(am4charts.DateAxis)
 * @ignore(am4charts.ValueAxis)
 * @ignore(am4charts.XYChart)
 * @ignore(am4core.create)
 */
qx.Class.define("tinyclone.charts.DailyVisitsChart", {
  extend: tinyclone.charts.BaseChart,


  members: {
    _transformData: function(data) {
      const chartData = data.map((val) => {
        return {
          date: new Date(val.getDate()),
          visits: val.getVisits()
        };
      });

      return chartData.sort((a, b) => a.date - b.date);
    },

    // runs when this widget first appears. am4charts objects
    // require a dom element when instatiated this is why we
    // instatiate them when we have one.
    _onAppear: function() {
      var element = this.getContentElement().getDomElement();
      const chart = this.__chart = am4core.create(element, am4charts.XYChart);

      var font = qx.theme.manager.Font.getInstance().resolve("small");

      const xAxis = chart.xAxes.push(new am4charts.DateAxis());
      xAxis.dateFormats.setKey("day", "dd/MM");
      xAxis.renderer.minGridDistance = 20;
      xAxis.renderer.labels.template.rotation = 45;
      xAxis.renderer.labels.template.verticalCenter = "bottom";
      xAxis.renderer.labels.template.horizontalCenter = "middle";
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.fontSize = font.getSize();
      xAxis.renderer.labels.template.fontFamily = font.getFamily();

      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.disabled = true;
      yAxis.calculateTotals = true;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.dateX = "date";

      const bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.label.text = "{valueY.total}";
      bullet.label.fontSize = font.getSize();
      bullet.label.fontFamily = font.getFamily();
      bullet.dy = -10;
      bullet.label.hideOversized = false;

      chart.data = this.getData();
    }
  }
});
