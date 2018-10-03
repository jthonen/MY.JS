var stockTerm = [];
var trendTerm = "";
var isTrendValid = false;
var isStockValid = false;

$(document).ready(function () {

    //initGraph();     // display example stock graph 

    getBusinessNews();

    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
        var trendVal = $("#trendTextId").val();
        isTrendValid = validateTrendInput(trendVal);

        if (isTrendValid) {
            stocks = $("#stockTextId").val();
            isStockValid = validateStockInput(stocks);
            if (isStockValid) {
                displayGraph();
            }
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
    
    
    // first ajax call for google trends - steven's node.js turned into a ajax callable api
    var term = 'pepsi';
    var queryurl = 'https://googletrendsthegame.herokuapp.com/trends?terms=' + term;

    $.ajax({
        url: queryurl,
        method: "GET"
    }).then(function(response) {
        var result = Object.values(response);
        var parseResults = JSON.parse(result);
        var timeData = parseResults.default.timelineData
        console.log(parseResults);
        var timeMonthVal = ''; 
        var trendValue = ''; 

        for (i = timeData.length -3 ; i< timeData.length ; i++) {
            var rawTime = timeData[i].formattedTime;
            //console.log(rawTime);
            var month = rawTime.split(" ");
            //console.log(month);
            var monthVal = month[0];
            var monthFormat = 
            console.log(monthVal);
            var value = timeData[i].value[0];
            console.log(value);    
            trendArray.push(monthVal, value);
        }
        console.log(trendArray);
    });

    currentMonth = moment().format('MM');
    startingMonth = currentMonth - 3;
    if (startingMonth <= 9)    {
        startingMonth = "0"+startingMonth+"";
    }
    var startingDate = moment().format('YYYY'+startingMonth+'DD');
    monthData = [[],[],[],[]];
    var tickerName = "MSFT";
    $.ajax({
        url: "https://api.iextrading.com/1.0/stock/"+tickerName+"/chart/3M/"+startingDate+"",
        method: "GET"
        }).then(function(response)  {
            console.log(response);
            for (i=0; i < response.length; i++) {
                var day = response[i];
                var date = day.date;
                var dataMonth = ""+date[5]+""+""+date[6]+"";
                monthData[dataMonth-startingMonth].push(day.close);
            };        
            var monthAverages = [];
            for (i=0; i < monthData.length; i++)   {
                var crunch = monthData[i];
                currentVal = 0;
                for (j=0; j < crunch.length; j++)   {
                    currentVal = currentVal + crunch[j];
                }
                var avgVal = (currentVal/crunch.length).toFixed(2);
                monthAverages.push(avgVal);
            };
            console.log(monthAverages);
            console.log("end of stock data print")
    });

    function getBusinessNews() {
        // call ajax to get latest business
        $("#article-id").empty();
        var name = $(this).attr("data-name");
        var queryURL = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=e20759f693844c8d9336061b37eb2d02";
        // Creates AJAX call 
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
                $("#article-id").empty();
                var results = response.articles;
                for (i = 0; i < results.length; i++) {
                    var listDiv = $("<div>");
                    var source = $("<p2>").addClass("font-italic").text("source: " + results[i].source.name);
                    source.append("<br>");
                    var newsHeading = $("<a>");
                    newsHeading.addClass("text-primary");
                    newsHeading.addClass("font-weight-bold");
                    newsHeading.attr("href", results[i].url);
                    newsHeading.attr("target", "_blank");
                    newsHeading.append(results[i].title);
                    var description = $("<h5>");
                    description.append(results[i].description);
                    listDiv.append(source).append(newsHeading).append(description);
                    //add new div to existing divs
                    $("#article-id").append(listDiv);
                }        
        });
    };

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
        width: 1200,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('google-trend-img'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }
    // function initGraph() {
    //     $("#google-trend-img").empty();
    //     var image = $("<img>").attr("src", "assets/images/trends-example.png");
    //     $("#google-trend-img").append(image);
    // }
});
