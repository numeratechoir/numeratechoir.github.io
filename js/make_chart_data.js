/* globals define */


define(['actuarial_table'], function(actuaryData) {


  return function(age) {
    var output = [];
    var livingFromStartToThisYear = 1;
    for (var i = age; i < actuaryData.length; i++) {
      var row = actuaryData[i];
      var dyingThisYear = row[1];
      var livingThisYear = 1 - dyingThisYear;
      var dyingInThisYearFromStart = livingFromStartToThisYear * dyingThisYear;
      livingFromStartToThisYear = livingFromStartToThisYear * livingThisYear;
      output.push([i, dyingInThisYearFromStart]);
    }
    return output;
  };


});
