$(function () {
  $.get('data/dangers.json', function(data) {
    // do something with your data
  });


  $('#total').highcharts({
      chart: {
          type: 'bar'
      },
      title: {
          text: 'Chance of Death'
      },
      yAxis: {
          min: 0,
          max: 100,
          title: {
              text: 'Percent'
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal'
          }
      },
      series: [{
          name: 'Cars',
          data: [1]
      }, {
          name: 'Bikes',
          data: [1]
      }, {
          name: 'Planes',
          data: [1]
      }]
  });

  $('#zoomed').highcharts({
      chart: {
          type: 'bar'
      },
      title: {
          text: 'Likely Causes'
      },
      yAxis: {
          min: 0,
          max: 100,
          title: {
              text: 'Percent'
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal'
          }
      },
      series: [{
          name: 'Cars',
          data: [1]
      }, {
          name: 'Bikes',
          data: [1]
      }, {
          name: 'Planes',
          data: [1]
      }]
  });
  
  //var chart = $('#container').highcharts();
  //chart.series[0].setValue([15])

  $("input.cause").keyup(function() {
      var planeVal = parseInt($("#a-amt").val())
      var carVal  = parseInt($("#b-amt").val())
      var bikeVal = parseInt($("#c-amt").val())

      if (isNaN(planeVal) || isNaN(carVal) || isNaN(bikeVal)) {
        $(".msg").show();
        return;
      }
      $(".msg").hide();
      var sum = planeVal + carVal + bikeVal;
      var total = $('#total').highcharts();
      var zoomed = $('#zoomed').highcharts();
      total.series[0].setData([100*planeVal/10000])
      total.series[1].setData([100*carVal/100000])
      total.series[2].setData([100*bikeVal/100000])
      zoomed.series[0].setData([100*planeVal/sum])
      zoomed.series[1].setData([100*carVal/sum])
      zoomed.series[2].setData([100*bikeVal/sum])
  });
});
