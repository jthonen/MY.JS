$(document).ready(function(){

    var stockTerm = $("#stockTextId").val().trim();
    var trendTerm = $("#trendTextId").val().trim();
    var isTrendValid = false;
    var isStockValid = false;

    //initGraph();     // display example stock graph 

    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
        var stockVal = $("#stockTextId").val().trim();
        var trendVal = $("#trendTextId").val().trim();
        isStockValid = validateStockInput(stockVal);
        isTrendValid = validateTrendInput(trendVal);
        if (isTrendValid && isStockValid) { 
            displayGraph();
        }
    })

    // eliminate empty stock name
    function validateStockInput(stockVal) {
        var stocks = [];
        if (stockVal === "") {
            console.log("stock is empty");
            $('#empty-stock').text(" *Stock symbol can not be empty");
            setTimeout(function () {
                $('#empty-stock').text("");
            }, 2000);
            isStockValid = false;
        }
        else {
            stocks = stockVal.split(",");
            for (var i = stocks.length - 1; i >= 0; i--) {
                stocks[i] = stocks[i].trim();
                if (stocks[i] === "") {
                    stocks.splice(i, 1);
                }
            }
            isStockValid = true;
        }
        stockTerm = stocks;
        return isStockValid;
    }

    function validateTrendInput(trend) {
        if (trend === "") {
            console.log("trend is empty");
            $('#empty-search').text(" *Trend can not be empty");
            setTimeout(function () {
                $('#empty-search').text("");
            }, 2000);
            isTrendValid = false;
        }
        else {
            isTrendValid = true;
        }
        trendTerm = trend;
        return isTrendValid;
    }

    trendArray = []
    
    
    // first ajax call for google trends - steven's node.js 
    var term = 'pepsi';
    var queryurl = 'https://googletrendsthegame.herokuapp.com/trends?terms=' + term;

    $.ajax({
        url: queryurl,
        method: "GET"
    }).then(function(response) {
        var result = Object.values(response);
        var parseResults = JSON.parse(result);
        var timeData = parseResults.default.timelineData
        for (i = 0; i< timeData.length; i++) {
            console.log(timeData[i].time)
            var time = moment(timeData[i].time).format("M:D");
            console.log(time);
            var value = timeData[i].value;
            console.log(value);
            trendArray.push(time, value)        
        }
    });

    // second ajax call for stock market api

    var term = 'APPL';
    var queryurl1 = "https://api.iextrading.com/1.0/stock/" + term + "/chart/1y";

    $.ajax({
        url: queryurl1, 
        method: "GET"
        }).then(function(response2){
            console.log(response2);
            for (i=0; i < response2.length; i++) {
                console.log(response2[i].close);
            };
            console.log("end of stock data print")
    });

  // Initialize Firebase

//   var config = {
//     apiKey: "AIzaSyAtquiygP1tikBs5Fr6w0hj9Y7oqrbn5EQ",
//     authDomain: "myjs-c48d7.firebaseapp.com",
//     databaseURL: "https://myjs-c48d7.firebaseio.com",
//     projectId: "myjs-c48d7",
//     storageBucket: "myjs-c48d7.appspot.com",
//     messagingSenderId: "96560492727"
//   };
//   firebase.initializeApp(config);

//   var database = firebase.database();

//   database.ref().on('value', function(snapshot) {

//   })  

  // google charts tech code 

    google.charts.load('current', {'packages':['line']});
        google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Day');
      data.addColumn('number', 'Guardians of the Galaxy');
      data.addColumn('number', 'The Avengers');
      data.addColumn('number', 'Transformers: Age of Extinction');

      data.addRows([
        [1,  37.8, 80.8, 41.8],
        [2,  30.9, 69.5, 32.4],
        [3,  25.4,   57, 25.7],
        [4,  11.7, 18.8, 10.5],
        [5,  11.9, 17.6, 10.4],
        [6,   8.8, 13.6,  7.7],
        [7,   7.6, 12.3,  9.6],
        [8,  12.3, 29.2, 10.6],
        [9,  16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11,  5.3,  7.9,  4.7],
        [12,  6.6,  8.4,  5.2],
        [13,  4.8,  6.3,  3.6],
        [14,  4.2,  6.2,  3.4]
      ]);

      var options = {
        chart: {
          title: 'Comparison of' + stockTerm + 'against' + trendTerm,
          subtitle: 'What are your wildest dreams?'
        },
        width: 1300,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('google-trend-img'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }
});