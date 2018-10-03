
var stockTerm = [];
var trendTerm = "";
var isTrendValid = false;
var isStockValid = false;

$(document).ready(function () {

    initGraph();     // display example stock graph 

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
        if (isStockValid) {
            trendTerm = $("#trendTextId").val();
            isTrendValid = validateTrendInput(trendTerm);
            if (isTrendValid) {
                displayGraph();
            }
        }
    })

    function getBusinessNews() {
        // call ajax to get latest business
        $("#article-id").empty();
        var name = $(this).attr("data-name");
        //var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=4JIvycUq3oYpZEEoUjlZhfz5orHCbC9D&q=" + name + "&limit=10&offset=0&rating=R&lang=en";
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
    }
})
