    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAGfO3B6dYL7iwUzej_0fYle9Fb9sbt_Qg",
      authDomain: "traintime-1d8bf.firebaseapp.com",
      databaseURL: "https://traintime-1d8bf.firebaseio.com",
      projectId: "traintime-1d8bf",
      storageBucket: "traintime-1d8bf.appspot.com",
      messagingSenderId: "142390850680",
      appId: "1:142390850680:web:d4c0431723cd9ccb74698d",
      measurementId: "G-GP700EB48J"
    };
  
    
  
  //Declare a variable
  firebase.initializeApp(firebaseConfig);
  
  const database = firebase.database();
  
  
  let name = "";
  let destination = "";
  let frequency = "";
  let firstTrain = "";
  
  $("#trainSheet").on("submit", function() {
  
    event.preventDefault();
  
    if (!validateForm()) {
      return false;
    }
  
    name = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstTrain = $("#firstTrain").val().trim();
  
    database.ref().push({
      name: name,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrain
    });
  
    $("#trainSheet")[0].reset();
  
  });
  
  database.ref().on("child_added", function(snapshot) {
  
    const freq = snapshot.val().frequency;
    const initialTime = snapshot.val().firstTrain;
  
    let nextTrain = calculateNextTrains(freq, initialTime);
    let times = calculateArrivalTime(nextTrain);
    let ChangedTime = times[0];
    let minutesAway = times[1];
  
  
    const newTableRow = $("<tr>");
  
    const newTableData =
    $("<td id='table-trainName'>" + snapshot.val().name + "</td>" +
    "<td id='table-train-destination'>" + snapshot.val().destination + "</td>" +
    "<td id='table-train-frequency'>" + snapshot.val().frequency + "</td>" +
    "<td id='table-train-arrival'>" + ChangedTime + "</td>"+
    "<td id='table-train-minutes'>" + minutesAway + "</td>");
  
    newTableRow.append(newTableData);
    $("#table-body").append(newTableRow);
  
  });
  
  function calculateNextTrains(freq, initialTime) {
  
    const timeMoment = moment(initialTime, "HH:mm");
  
    const endOfDay = moment("23:59", "HH:mm");
  
    const timetable = [];
  
    
    for (let i = timeMoment; i.isSameOrBefore(endOfDay); i.add(freq, "minutes")) {
      let times = i.format("HH:mm");
      timetable.push(times);
    }
  
    let now = moment();
  
    let futureTrains = [];
  
    for (var i = 0; i < timetable.length; i++) {
      if (moment(timetable[i], "HH:mm").isAfter(now)) {
        futureTrains.push(timetable[i]);
      }
    }
  
    let nextTrain = futureTrains[0];
  
    return nextTrain;
  
  }
  
  function calculateArrivalTime(nextTrain) {
    let now = moment();
    let minutesAway = moment(nextTrain, "HH:mm").diff(now, "minutes");
    let ChangedTime = moment(nextTrain, "HH:mm").format("h:mm a");
    return [ChangedTime, minutesAway];
  }
  
  
  function validateForm() {
    let firstTrainTimes = $("#firstTrain").val().trim().split(":");
  
    if (!validateFirstTrainTime(firstTrainTimes[0], firstTrainTimes[1])) {
      return false;
    }
    return true;
  }
  
  function validateFirstTrainTime(hours, minutes) {
    if (!((hours >= 00 || hours >= 0) && (hours <= 23))) {
      return false;
    }
    if (!((minutes >= 00) && (minutes <= 59))) {
      return false;
    }
    return true;
  }