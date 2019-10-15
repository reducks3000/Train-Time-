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
  
