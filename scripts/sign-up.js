import { auth, database } from './firebase.js';

import { ref, set} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; 

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"; 

const fgtPwdLink =  document.querySelector('.fgt-pwd');

document.addEventListener('DOMContentLoaded', () => {
  const signUpBtn = document.querySelector('.js-sign-in-button');
  signUpBtn.addEventListener('click', signUp)
  // sendOTP();
});

function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password) 
  .then((userCredential) => {
    const user = userCredential.user;  
    localStorage.setItem("userId", user.uid);
    localStorage.setItem("userEmail", user.email);
    console.log('User signed up: ', user.uid); 

    // Prepare user data  
    const userDetails = {  
      email: email,  
      uid: user.uid,  
      createdAt: new Date().toISOString(),  
      status: 'Active',
      goldBalance: 0
    };

    // Save user details to Realtime Database  
    return set(ref(database, 'users/' + user.uid), userDetails); 
  })
  .then(() => {
    console.log('User added to database successfully');  
    window.location.href="sign-in.html";
  })
  .catch((error) => {  
    console.error('Error signing up: ', error.message);  
    alert('Sign up failed: ' + error.message); 
  });
}

fgtPwdLink.addEventListener('click', ()=> {
  alert('Service Unavailable, try again later....');
});



