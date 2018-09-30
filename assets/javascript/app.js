
var stockTerm = [];
var trendTerm = null;
var isTrendValid = false;
var isStockValid = false;

$(document).ready(function () {

    initGraph();     // display example stock graph 

    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
        var trendVal = $("#trendTextId").val();
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

    function initGraph() {
        $("#google-trend-img").empty();
        var image = $("<img>").attr("src", "assets/images/trends-example.png");
        $("#google-trend-img").append(image);
    }

    // calling api here and display the graph
    function displayGraph() {
        $("#google-trend-img").empty();
        var image = $("<img>").attr("src", "assets/images/trends-example.png");
        $("#google-trend-img").append(image);
    }

    $("#searchStock").on("click", function (event) {
        event.preventDefault();
        var stockVal = $("#stockTextId").val();
        isStockValid = validateStockInput(stockVal);

        if (isTrendValid && isStockValid) {
            displayGraph();
        }
    })
})
