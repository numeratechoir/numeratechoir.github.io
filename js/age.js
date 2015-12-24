/* globals require */
/* globals $ */


require([
  'make_chart_data',
  'underscore',
  'text!templates/home.html'
], function(
  getDataForAge,
  _,
  homeHtml
) {
  
  $(function () {
    var homeTemplate = _.template(homeHtml);
  
    // inverse of jQuery.param()
    var querystringToObject = function(qs) {
      var out  = {},
        match  = true,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
          return decodeURIComponent(s.replace(pl, " "));
        };   
      while (match = search.exec(qs)) {  // jshint ignore:line
        out[decode(match[1])] = decode(match[2]);
      }
      return out; 
    };
  
    var getUrlParams = function() {
      var query  = window.location.search.substring(1);
      return querystringToObject(query);
    };
  
    var urlParams = getUrlParams();
    var age = parseInt(urlParams.age || 30);
    var sex = urlParams.sex || 'male';
    
    var data = getDataForAge(age, sex);
    
    var expectedAge = age;
    var pct = 0;
    _.find(data, function(row) {
      pct += row[1];
      if (pct > 0.5) {
        expectedAge = row[0];
        return true;
      }
    });
    
    var html = homeTemplate({
      age: age, 
      data: data, 
      expectedAge: expectedAge,
      sex: sex,
    });
  
    $('body').html(html);
  
    $('#container').highcharts({
      title: {
        text: null,
      },
      xAxis: {
        categories: _.map(data, function(d) { return d[0]; }), 
      },
      yAxis: {
        title: {
          text: 'Temperature (°C)'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      series: [{
        name: 'Baseline Life Expectancy',
        data: _.map(data, function(d) { return d[1]; })
      }]
    });

    var plot = function(series_data) {
      var chart = $('#container').highcharts();
      if (chart.series.length === 1) {
        chart.addSeries({
          name: 'Customized Life Expectancy',
          data: _.map(series_data, function(d) { return d[1] })
        });
      } else {
        chart.series[1].setData(series_data);
      }
    };

    $('#plot').click(function () {
      for (k in data) {
        data[k][1] = data[k][1] * 2
      }
      plot(data);
    });

  });

});

