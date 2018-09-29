$(document).ready(function () {
    console.log("ready!");

    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
        var trendVal = $("#trendTextId").val();
        console.log("trendVal : " + trendVal);
        var trend = validTrendInput(trendVal);
    })

    // eliminate empty stock name
    function validStockInput(stockVal) {
        var stocks = [];
        stocks = stockVal.split(",");
        for (var i = stocks.length - 1; i >= 0; i--) {
            stocks[i] = stocks[i].trim();
            if (stocks[i] === "") {
                stocks.splice(i, 1);
            }
        }
        return stocks;
    }

    function validTrendInput(trend) {
        if (trend === "") {
            console.log("trend is empty");
        }
        else {
            console.log("good");
        }
        return trend;
    }

    $("#searchStock").on("click", function (event) {
        event.preventDefault();
        var stockVal = $("#stockTextId").val();
        var stocks = [];
        stocks = validStockInput(stockVal);
        // DEBUG print out the array values
        for (var i = 0; i < stocks.length; i++) {
            console.log("name: " + stocks[i]);
        }
        $("#google-trend-img").empty();
        var image = $("<img>").attr("src", "assets/images/trends-example.png");
        $("#google-trend-img").append(image);

    })
})