$(document).ready(function () {
    console.log("ready!");


    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
    })

    $("#searchStock").on("click", function (event) {
        event.preventDefault();
        console.log("searchstock click");
    })
})