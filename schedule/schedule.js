// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA07lUMH1HyCjBi_eKe-4gaz1b9FhdSZiE",
    authDomain: "havarena-f3d87.firebaseapp.com",
    databaseURL: "https://havarena-f3d87.firebaseio.com",
    projectId: "havarena-f3d87",
    storageBucket: "havarena-f3d87.appspot.com",
    messagingSenderId: "259369291947",
    appId: "1:259369291947:web:6233862e160cc6bfce67ee",
    measurementId: "G-STKZ9T8L1C"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

// Build table on desktop

function buildTable() {
  const table = document.getElementById('table');
  table.style.display = "table";

  var hour = 9;
  var min = "00";

  for (var i = 0; i < 27; i++) {
    const tr = document.createElement('tr');
    const date = document.createElement('td');

    date.innerHTML = hour + "h" + min;
    if (min == "30") {
      min = "00";
      hour++;
    } else {
      min = "30";
    }

    date.style.width = "5vw";

    tr.appendChild(date);

    for (var i2 = 0; i2 < 5; i2++) {
      const collum = document.createElement('td');
      collum.id = i + "/" + i2;
      tr.appendChild(collum);
    }

    table.appendChild(tr);
  }

  firebase.database().ref('schedule').on('child_added', function(snap) {
    const cellCollum = snap.val().week_day;
    const cellRow = snap.val().start_time;
    const cellLenght = (snap.val().end_time - cellRow);

    const currentCell = document.getElementById(cellRow+"/"+cellCollum);
    currentCell.innerHTML = snap.val().title;
    currentCell.rowSpan = cellLenght+1;
    currentCell.className = "hasContent mode"+snap.val().type;
    currentCell.onclick = function() {inflateInfo(snap.key)};
  });

  // Remove unused cells
  firebase.database().ref('schedule').once('value').then(function() {
    for (var i = 0; i < 27; i++) {
      for (var i2 = 0; i2 < 5; i2++) {
        const analysedCell = document.getElementById(i+"/"+i2);
        if (analysedCell.innerHTML == "") {
          analysedCell.parentNode.removeChild(analysedCell);
        }
      }
    }
  })
}

function buildSchedule() {
  const globalHolder = document.getElementById('schedule');

  for (var i = 0; i < 5; i++) {
    var hour = 9;
    var min = "00";

    const weekDays = ['Segunda','Terça','Quarta','Quinta','Sexta'];
    const table = document.createElement('table');
    const title = document.createElement('h2');
    title.innerHTML = weekDays[i]+"-Feira";
    globalHolder.appendChild(title);

    for (var i2 = 0; i2 < 27; i2++) {
      const tr = document.createElement('tr');
      const date = document.createElement('td');

      date.innerHTML = hour + "h" + min;
      if (min == "30") {
        min = "00";
        hour++;
      } else {
        min = "30";
      }

      date.style.width = "fit-content";
      date.style.textAlign = "left";

      tr.appendChild(date);

      const collum = document.createElement('td');
      collum.id = i2 + "/" + i;
      tr.appendChild(collum);
      table.appendChild(tr);

      table.cellspacing="2";
      table.cellpadding="5"
      table.style.width= "95%";

      globalHolder.appendChild(table);
    }
  }

  firebase.database().ref('schedule').on('child_added', function(snap) {
    const cellCollum = snap.val().week_day;
    const cellRow = snap.val().start_time;
    const cellLenght = (snap.val().end_time - cellRow);

    const currentCell = document.getElementById(cellRow+"/"+cellCollum);
    currentCell.innerHTML = snap.val().title;
    currentCell.rowSpan = cellLenght+1;
    currentCell.className = "hasContent mode"+snap.val().type;
    currentCell.onclick = function() {inflateInfo(snap.key)};
  });

  firebase.database().ref('schedule').once('value').then(function() {
    for (var i = 0; i < 27; i++) {
      for (var i2 = 0; i2 < 5; i2++) {
        const analysedCell = document.getElementById(i+"/"+i2);
        if (analysedCell.innerHTML == "") {
          analysedCell.parentNode.removeChild(analysedCell);
        }
      }
    }
  })
}

if (window.innerWidth > 800) {
  buildTable();
} else {
  buildSchedule()
}

firebase.database().ref('schedule').once('value').then(function() {
  document.getElementById('loading').style.display = "none";
  document.getElementById('hiddenBody').style.display = "block";
})

// inflateInfo
const colors = ["#a5d6a7","#c4c4c4","#fff49d","#fdc391","",""];

function inflateInfo(eventNumber) {
  firebase.database().ref('schedule/'+eventNumber).once('value').then(function(snap) {
    document.getElementById('eventTitle').innerHTML = snap.val().title;
    document.getElementById('eventDescription').innerHTML = (snap.val().desc) ? snap.val().desc : "Descrição não informada.";
    document.getElementById('cube').className = "mode"+snap.val().type;
    document.getElementById('modalImage').style.backgroundImage = "url('./files/image/bg"+snap.val().type+".svg')";
    document.getElementById('modalImage').style.backgroundColor = colors[snap.val().type];
    openModal();
  })
}

// Default code

headerShadow();
function headerShadow() {
	if (document.body.scrollTop == 0 || document.documentElement.scrollTop == 0){
		document.getElementById("header").className = "headerNoShadow";
	}
  if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
		document.getElementById("header").className = "";
	}
}

var popupShow = false;
var signedIn = false;

function popup() {
  var user = firebase.auth().currentUser;
  const popupLogged = document.getElementById("popupMenuLogged");
  const popupMenu = document.getElementById("popupMenu");
  const userPhoto = document.getElementById("userPhoto");

  if (popupShow == false) {
    if (user) {
      popupLogged.className = "popupMenu";
    } else {
      popupMenu.className = "popupMenu";
    }
    popupShow = true;

    window.onclick = function() {
      if (event.target != popupMenu && event.target != popupLogged && event.target != userPhoto) {
        popupMenu.className = "popupMenu hide";
        popupLogged.className = "popupMenu hide";
        popupShow = false;
      }
    }

  } else {
    popupMenu.className = "popupMenu hide";
    popupLogged.className = "popupMenu hide";
    popupShow = false;
  }

  loadPage();
}

var team;

function loadPage() {
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid, emailVerified;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;

      document.getElementById('userName').innerHTML = name;
      document.getElementById('userEmail').innerHTML = email;
      document.getElementById("userPhoto").style.backgroundImage = "url('"+photoUrl+"')";

      // Define team
      const currentUser = firebase.auth().currentUser;
      var dbRef = firebase.database().ref('users/' + currentUser.uid + "/team");
      dbRef.on('value', function(snapshot) {
        team = snapshot.val();
        // defineBgColor(team); Still haven't decided if this will be kept
      });
    }
  });
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    location.reload();
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}

var menuOpen = false;
function openMenu() {
  const menu = document.getElementById("menu");
  const menuHolder = document.getElementById("menuHolder");
  const sandwich = document.getElementById("sandwich");

  if (menuOpen == false) {
    menu.className = "show";
    menuHolder.className = "shadow"
    window.onclick = function() {
      if (event.target != menu && event.target != sandwich) {
        menu.className = "";
        menuHolder.className = ""
        menuOpen = false;
      }
    }
    menuOpen = true;
  } else {
    menu.className = "";
    menuHolder.className = ""
    menuOpen = false;
  }
}

// Modal popup
const modal = document.getElementById("modal");
function openModal() {
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
