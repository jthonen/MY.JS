$(document).ready(function(){

    trendArray = []
         
    var term = 'pepsi';
    var queryurl = 'https://googletrendsthegame.herokuapp.com/trends?terms=' + term;

    $.ajax({
        url: queryurl,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        var result = Object.values(response);
        console.log(result);
        var parseResults = JSON.parse(result);
        var timeData = parseResults.default.timelineData
        console.log(timeData);
        for (i = 0; i< timeData.length; i++) {
            console.log(timeData[i].time)
            var time = moment(timeData[i].time).format("M:D");
            var value = timeData[i].value;
            trendArray.push(time, value)        
        }
    });


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

  database.ref().on('value', function(snapshot) {

  })  
});