/* globals require */


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
    
    var data = getDataForAge(age);
    
    var max = _.max(data, function(row){ return row[1]; });
    var maxChance = max[1];
  
    var expectedAge = age;
    var pct = 0;
    _.find(data, function(row) {
      pct += row[1];
      if (pct > 0.5) {
        expectedAge = row[0];
        return true;
      }
    });
    
    var html = homeTemplate({age: age, data: data, expectedAge: expectedAge});
  
    $('body').html(html);
  
    $('#container').highcharts({
      title: {
        text: 'Monthly Average Temperature',
        x: -20 //center
      },
      xAxis: {
        categories: _.map(data, function(d) { return d[0] }), 
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
        name: 'Tokyo',
        data: _.map(data, function(d) { return d[1] })
      }]
    });
  });

});

