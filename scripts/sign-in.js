import { auth, database } from './firebase.js';

import { ref, onValue} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; 

import {  signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  


document.addEventListener('DOMContentLoaded', () => {
  const signInBtn = document.getElementById('sign-btn');
  signInBtn.addEventListener('click', signIn)
});


function signIn(){
  let email = document.getElementById('email').value;
  const password = document.getElementById('password').value; 
  localStorage.setItem("userpassword", password);

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;  
    console.log('User signed in: ', user.uid);

    const userRef = ref(database, 'users/' + user.uid);  

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if(data){
        document.querySelector('#sign-btn').innerHTML = 'Please wait...';
        localStorage.setItem("userName", data.name)
        sessionStorage.setItem('isLoggedIn', true);
        sendOTP();
        return true;
      }else{
        alert('Wrong password')
        return false;
      }
    });
  })

  // for (let userid in users) {
  //   if (users[userid].email === emailInput) {
  //     if( users[userid].password === password){
  //       // alert('Sign in successful!');
  //       signInWithEmailAndPassword (auth)
  //       .then(() => {
  //         console.log('Anonymous authentication successful.')
  //       })
  //       .catch((error) => {
  //         console.error('Anonymous authentication failed:', error);
  //       });
  //       const userRef = ref(database, 'users/' + userid);  

  //       onValue(userRef, (snapshot) => {
  //         snapshot.val();
  //         // const data = snapshot.val();
  //         // console.log(data);
  //       });
  //       push(userRef, users[userid])
  //       .then(() => {
  //         // console.log("User saved successfully!");
  //       }).catch((error) => {
  //         console.error("Error saving user:", error);
  //       });
  //       document.querySelector('#sign-btn').innerHTML = 'Please wait...';
  //       sessionStorage.setItem('isLoggedIn', true);
  //       localStorage.setItem("userName", users[userid].name);
  //       localStorage.setItem("userId", users[userid].id);
  //       localStorage.setItem("userChackings", users[userid].checking);
  //       localStorage.setItem("userSavings", users[userid].saving);
  //       sendOTP();
  //       return true;
  //     }else{
  //       alert('Wrong password')
  //       return false;
  //     }
  //   }
  // } 
  // alert('Email not found');
}

function sendOTP() {
  // Reference  
  let emailInput = document.getElementById('email').value;
  sessionStorage.setItem("userEmail", emailInput);
  const otpverify = document.getElementsByClassName('otpverify')[0];
  const otpBtn = document.querySelector('.opt-btn');
  let otpInp = document.getElementById('opt-input');
  const mainForm = document.querySelector('.main-form');
  const serviceID = 'service_kwwsd5c';
  const templateID = 'template_dgocp4a';

  // Generate an OTP 
  let otp = Math.floor(Math.random() * 1000000);
  // console.log(otp)

  let templateParam = {
    from_name: 'MB Finance Online Banking',
    otp: otp,
    nessage: 'Please Confirm your OTP',
    reply_to: emailInput
  }

  emailjs.send(serviceID, templateID, templateParam).then((res) =>{
    console.log(res);
    otpverify.style.display = "block";
    mainForm.style.display = "none";
    console.log('sent');
    otpBtn.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('clicked');
      if(otpInp.value == otp){
        // alert('Email address verified...');
        window.location.replace("/my_account.html");
      }else(
        alert('Incorrect Otp')
      )
    });  
  }, error => {
    console.log(error)
  });

}

// const fgtPwdLink =  document.querySelector('.fgt-pwd');

// fgtPwdLink.addEventListener('click', ()=> {
//   alert('Service Unavailable, try again later....');
// });
