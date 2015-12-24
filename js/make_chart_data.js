/* globals define */


define(['actuarial_table'], function(actuaryData) {


  return function(age, sex) {
    var output = [];
    var data = actuaryData[sex];
    var livingFromStartToThisYear = 1;
    for (var i = age; i < data.length; i++) {
      var row = data[i];
      var dyingThisYear = row[1];
      var livingThisYear = 1 - dyingThisYear;
      var dyingInThisYearFromStart = livingFromStartToThisYear * dyingThisYear;
      livingFromStartToThisYear = livingFromStartToThisYear * livingThisYear;
      output.push([i+1, dyingInThisYearFromStart]);
    }
    return output;
  };


});
