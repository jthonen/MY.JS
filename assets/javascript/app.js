$(document).ready(function () {
    console.log("ready!");

    #navigation,.navbar .navbar-default{
        background-image: url("assets/images/flower.jpg");
      }


    $("#searchTrend").on("click", function (event) {
        event.preventDefault();
        console.log("searchTrend click");
})

    $("#searchStock").on("click", function (event) {
        event.preventDefault();
        console.log("searchstock click");
    })
})