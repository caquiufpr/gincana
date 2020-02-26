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

const teamColors = ["#005c8d","#c43030","#d1ad1e","#00b661","#94007e","#4d4d4d","#e7660b","#00b87e","#e91e63","#009ae6","#9e9c00","#00a89b","#a9a9a9","#172c88","#653c32","#01be87"];

function getInfo() {
  for (var i = 0; i < 30; i++) {
    firebase.database().ref('approved/Activity '+i).orderByKey().limitToLast(50).on('child_added', function(s) {
      var by = s.val().sentBy;
      var team = (s.val().team) ? s.val().team : s.key;
      var activity = s.ref.parent.key;
      var time = s.val().sentOn;
      var reasons = null;

      inflate(0, by, team, activity, time, reasons);
    })
    firebase.database().ref('rejected/Activity '+i).orderByKey().limitToLast(50).on('child_added', function(s) {
      var by = s.val().sentBy;
      var team = (s.val().team) ? s.val().team : s.key;
      var activity = s.ref.parent.key;
      var time = s.val().sentOn;
      var reasons = (s.val().reasons) ? s.val().reasons : "Motivos não registrados";

      inflate(1, by, team, activity, time, reasons);
    })
  }
}

function inflate(mode, by, team, activity, time, reasons) {
  if (mode == 0) {
    const div = document.getElementById('apList');
    const newDiv = document.createElement('div');
    newDiv.className = "li";
    const p = document.createElement('p');
    p.innerHTML = 'Enviado por: ' + by + '<br/>' +
                  'Equipe: ' + team + '<br/>' +
                  'Atividade: ' + activity.replace('Activity ','') + '<br/>' +
                  'Data do envio: ' + new Date(time) + '<br/>';
    newDiv.appendChild(p);
    div.insertBefore(newDiv, div.firstChild);
  } else {
    const div = document.getElementById('reList');
    const newDiv = document.createElement('div');
    newDiv.className = "li";
    const p = document.createElement('p');
    p.innerHTML = 'Enviado por: ' + by + '<br/>' +
                  'Equipe: ' + team + '<br/>' +
                  'Atividade: ' + activity.replace('Activity ','') + '<br/>' +
                  'Data do envio: ' + new Date(time) + '<br/>' +
                  'Motivos para rejeição: ' + reasons;
    newDiv.appendChild(p);
    div.insertBefore(newDiv, div.firstChild);
  }
}

getInfo();

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
