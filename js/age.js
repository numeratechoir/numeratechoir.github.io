/* globals require */


require([
  'jquery',
  'd3',
  'make_chart_data',
  'underscore',
  'text!templates/home.html'
], function(
  $,
  d3,
  getDataForAge,
  _,
  homeHtml
) {
  
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
  var expectedAge = max[0];
  
  var html = homeTemplate({age: age, data: data, expectedAge: expectedAge});

  $('body').html(html);

  var x = d3.scale.linear().range([0, data.length]);
  var y = d3.scale.linear().range([maxChance, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");

  var yAxis = d3.svg.axis().scale(y).orient("left");


});

