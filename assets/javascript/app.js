$(document).ready(function () {
    console.log("ready!");


    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
        var trendVal = $("#trendTextId").val();
        console.log("trendVal : "+trendVal);
    })

    $("#searchStock").on("click", function (event) {
        event.preventDefault();
        console.log("searchstock click");
        var stockVal = $("#stockTextId").val();
        console.log("stockVal : "+stockVal);
    })
})