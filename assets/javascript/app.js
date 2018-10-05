var stockTerm = [];
var trendTerm = "";
var isTrendValid = false;
var isStockValid = false;
currentMonth = moment().format('MM');
startingMonth = currentMonth - 3;
if (startingMonth <= 9) {
    startingMonth = "0" + startingMonth + "";
}
var startingDate = moment().format('YYYY' + startingMonth + 'DD');
monthData = [[], [], [], []];
var tickerName = "";
var monthAverages = [];
var trendPoints = [];

// Initialize Firebase

var config = {
    apiKey: "AIzaSyAtquiygP1tikBs5Fr6w0hj9Y7oqrbn5EQ",
    authDomain: "myjs-c48d7.firebaseapp.com",
    databaseURL: "https://myjs-c48d7.firebaseio.com",
    projectId: "myjs-c48d7",
    storageBucket: "myjs-c48d7.appspot.com",
    messagingSenderId: "96560492727"
};

firebase.initializeApp(config);
var database = firebase.database();
var stockRef = database.ref("/stocks");

stockRef.on("child_added", function (snapshot) {
console.log("add");
    // Console.loging the last user's data
    var tickerName = snapshot.val().name;
    var trendName = snapshot.val().trend;
})

function updateFirebase() {
    var name = stockTerm[0];
    console.log("name:"+name);
    var trend = trendTerm;
    console.log("trend: "+trend);
    var info = {
        name: name,
        trend:trend
    }
    stockRef.push(info);
}

$(document).ready(function () {

    getBusinessNews();
    // get data from firebase
    // fill in data
    // call function
   // initGraph();

    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
        var trendVal = $("#trendTextId").val();
        isTrendValid = validateTrendInput(trendVal);

        if (isTrendValid) {
            stocks = $("#stockTextId").val();
            isStockValid = validateStockInput(stocks);
            if (isStockValid) {
                monthAverages = [];
                trendPoints = [];
                updateFirebase();
                trendSearch();
                stockSearch();

            }
        }
    })

    // eliminate empty stock name
    function validateStockInput(stockVal) {
        var stocks = [];
        if (stockVal === "") {
            console.log("stock is empty");
            $('#empty-stock').text(" *Stock symbol can not be empty");
            // setTimeout(function () {
            //     $('#empty-stock').text("");
            // }, 2000);
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
            // setTimeout(function () {
            //     $('#empty-search').text("");
            // }, 2000);
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
    function trendSearch() {
        var googleURL = "https://googletrendsthegame.herokuapp.com/trends?terms=" + trendTerm + "";
        $.ajax({
            url: googleURL,
            method: "GET"
        }).then(function (response) {
            var results = Object.values(response);
            var parsedResults = JSON.parse(results);
            var timelineData = parsedResults.default.timelineData;
            rearrangedSet = [];
            for (var k = timelineData.length; k > -1; k -= 1) {
                rearrangedSet.push(timelineData[k]);
            }
            var trendObject = [];
            for (i = 0; i < 5; i++) {
                if (rearrangedSet[i] === undefined) continue
                else {
                    trendObject.push(rearrangedSet[i]);
                }
            };
            for (i = 0; i < trendObject.length; i++) {
                trendPoints[i] = trendObject[i].value[0];
                trendPoints.push(trendPoints[i]);
            };
            trendPoints.splice(-1, 1);
            console.log("end of trends data print")
            return trendPoints;
        });
        console.log(trendPoints);
    };

    function stockSearch() {
        currentMonth = moment().format('MM');
        startingMonth = currentMonth - 3;
        if (startingMonth <= 9) {
            startingMonth = "0" + startingMonth + "";
        }
        var startingDate = moment().format('YYYY' + startingMonth + 'DD');
        monthData = [[], [], [], []];
        var tickerName = stockTerm[0];
        $.ajax({
            url: "https://api.iextrading.com/1.0/stock/" + tickerName + "/chart/3M/" + startingDate + "",
            method: "GET"
        }).then(function (response) {
            for (i = 0; i < response.length; i++) {
                var day = response[i];
                var date = day.date;
                var dataMonth = "" + date[5] + "" + "" + date[6] + "";
                monthData[dataMonth - startingMonth].push(day.close);
            };
            for (i = 0; i < monthData.length; i++) {
                var crunch = monthData[i];
                currentVal = 0;
                for (j = 0; j < crunch.length; j++) {
                    currentVal = currentVal + crunch[j];
                }
                var avgVal = (currentVal / crunch.length).toFixed(2);
                monthAverages.push(avgVal);
            };
            console.log(monthAverages);
            console.log("end of stock data print")
            googlechart(tickerName, trendTerm);
        });
    };



    // google charts tech code 
    function googlechart(stock, trend) {
        // This section is to load the google chart
        google.charts.load('current', { 'packages': ['line'] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Date');
            data.addColumn('number', stock + " Avg. Monthly Stock Price");
            data.addColumn('number', trend + " = Search Query");

            data.addRows([
                ["Jul. 30, 2018", Number(monthAverages[0]), trendPoints[3]],
                ["Aug. 30, 2018", Number(monthAverages[1]), trendPoints[2]],
                ["Sep. 30, 2018", Number(monthAverages[2]), trendPoints[1]],
            ]);

            var options = {
                chart: {
                    title: stockTerm[0] + ' Average Monthly Stock Price',
                    subtitle: 'in dollars (USD)'
                },
                width: 1200,
                height: 550,
                vAxis: {
                    viewWindowMode: 'explicit',
                    viewWindow: {
                        min: 0,
                        max: (100 || 500 || 1000 || 5000)
                    }
                },
                series: {
                    0: { axis: 'stockPrice' },
                    1: { axis: 'trendPoints' }
                },
                axes: {
                    x: {
                        0: { side: 'bottom' }
                    },
                    y: {
                        stockPrice: { label: 'Avg. Monthly Stock Price' },
                        trendPoints: { label: "Query Monthly Trend 'Value'" }
                    }
                }
            };

            var chart = new google.charts.Line(document.getElementById('google-trend-img'));
            chart.draw(data, google.charts.Line.convertOptions(options));
            console.log(monthAverages);
            console.log(trendPoints);
            console.log('ChartDrawn');
        };
    }

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
                listDiv.append(source).append(newsHeading).append(description).append("<br>");
                //add new div to existing divs
                $("#article-id").append(listDiv);
            }
        });
    };

    $("#addTrainId").on("click", function (event) {
        event.preventDefault();

        // get user input
        var trainName = $("#trainNameId").val().trim();
        var destination = $("#destinationNameId").val().trim();
        var startTime = $("#firstTrainTimeId").val();
        var freq = $("#frequencyTimeId").val();

        var trainInfo = {
            trainName: trainName,
            destination: destination,
            startTime: startTime,
            freq: freq
        };

        // Uploads new train to the database
        trainRef.push(trainInfo);
    })
});
