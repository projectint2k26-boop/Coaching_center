import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCzyTDMboNeJ-KabClFZUhY0STmCegG3W8",
    authDomain: "coachingcenter-497dc.firebaseapp.com",
    projectId: "coachingcenter-497dc",
    storageBucket: "coachingcenter-497dc.firebasestorage.app",
    messagingSenderId: "448244917936",
    appId: "1:448244917936:web:1eadbf543f75fc678fbd75",
    measurementId: "G-K2J7CRLH7H"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Auth Modal UI Logic
  window.openAuthModal = function() {
    document.getElementById('auth-overlay').classList.add('active');
    document.getElementById('auth-error').style.display = 'none';
  }
  
  window.closeAuthModal = function() {
    document.getElementById('auth-overlay').classList.remove('active');
  }
  


  function showError(msg) {
    const err = document.getElementById('auth-error');
    err.textContent = msg;
    err.style.display = 'block';
  }

  // Firebase Handlers
  document.getElementById('google-login-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider).then(() => closeAuthModal()).catch(e => showError(e.message));
  });


  document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    if(!email || !pass) return showError("Please fill all fields");
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => closeAuthModal())
      .catch(e => showError(e.message));
  });



  window.logoutUser = function() {
    signOut(auth);
  }

  // Auth State Observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('login-nav-btn').style.display = 'none';
      document.getElementById('user-profile').style.display = 'flex';
      const displayName = user.displayName || user.email.split('@')[0];
      document.getElementById('user-name-display').textContent = displayName;
      document.getElementById('user-avatar-initial').textContent = displayName.charAt(0).toUpperCase();
    } else {
      document.getElementById('login-nav-btn').style.display = 'block';
      document.getElementById('user-profile').style.display = 'none';
    }
  });