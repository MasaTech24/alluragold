import { auth, database } from './firebase.js';

import { ref, onValue, query, orderByChild, equalTo, get} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; 

import {  signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  


document.addEventListener('DOMContentLoaded', () => {
  const signInBtn = document.getElementById('sign-btn');
  signInBtn.addEventListener('click', signIn)
});


async function signIn(event){
  event.preventDefault();
  let identifier  = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value; 
  localStorage.setItem("userpassword", password);

  const signInBtn = document.getElementById('sign-btn');

  if (!identifier) {  
    alert('Please enter a valid email or username.');  
    return; // Exit if the email is not valid  
  } 

    // Handle email validation only if it looks like an email  
    if (validEmail(identifier)) {  
      alert('Email format is valid');  
    } else if (identifier.length < 5) {   
      alert('Username should be at least 5 characters long.');  
      return; // Exit if username is too short  
    }  
  
  signInBtn.disabled = true;  
  signInBtn.innerHTML = "Please wait...";  
   
  try{
    await signInWithEmailAndPassword(auth, identifier, password);
    const user = auth.currentUser;
    console.log('User signed in: ', user.uid); 
    handleUserData(user);
    
  } catch (emailError) {   
    // handle specific error messages  
    if(emailError.code === "auth/user-not-found"){
      alert('No user found with this email. Please register.');    
    }else if(emailError.code === "auth/wrong-password"){
      alert('Incorrect password. Please try again.');  
    }else if(emailError.code === "auth/too-many-requests") {
      alert('Too many failed login attempts. Please try again later.');  
    } else if (emailError.code === 'auth/invalid-credential') {  
      alert('Invalid credentials. Please ensure your email and password are correct.');  
    } else{
      console.error('Error signing in with email:', emailError.message);
    }

    const userQuery = query(ref(database, 'users'), orderByChild('username'), equalTo(identifier));  
    const snapshot = await get(userQuery);  

    if (snapshot.exists()) {
      const userData = snapshot.val()[Object.keys(snapshot.val())[0]];  
      const userEmail = userData.email; 

      try {
        await signInWithEmailAndPassword(auth, userEmail, password); 
        console.log('User signed in successfully with username.');
        handleUserData(userData);     

      } catch (signinError) {  
        console.error('Error signing in with username:', signinError.message);  
        if(signinError.code === "auth/wrong-password"){
          alert('Incorrect password for the username. Please try again.');  
        }else if (signinError.code === "auth/user-not-found"){
          alert('No user found with this username. Please check.');  
        }else if (signinError.code === "auth/too-many-requests"){
          alert('Too many failed login attempts with username. Please try again later.');  
        } else if (signinError.code === 'auth/invalid-credential') {  
          alert('Invalid Password for this user. Please check and try again.');  
        }else {
          console.error('Sign in failed: ' + signinError.message);  
        }
      }  
    }else{
      alert('No user found with that username or email.');  
    }
  }finally {  
    // Always re-enable the sign-in button and reset text  
    signInBtn.disabled = false;  
    signInBtn.innerHTML = "SIGN IN";  
  }
  // signInWithEmailAndPassword(auth, email, password)
  // .then((userCredential) => {
  //   const user = userCredential.user;  
  //   console.log('User signed in: ', user.uid);

  //   const userRef = ref(database, 'users/' + user.uid);  

  //   const signInBtn = document.querySelector('#sign-btn');
  
  //   this.disabled = true;
  //   signInBtn.innerHTML= "Please wait..."
  //   onValue(userRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if(data){
  //       localStorage.setItem("userName", data.name)
  //       localStorage.setItem("userId", data.uid);
  //       sendOTP();
  //       // return true;
  //     }else{
  //       alert('Account Not found');
  //       return false;
  //     }
  //   })
  // })

}

function handleUserData(user) {  
  const userRef = ref(database, 'users/' + user.uid);  
 
  onValue(userRef, (snapshot) => {  
    const data = snapshot.val();  
    if (data) {  
      localStorage.setItem("userName", data.username); 
      localStorage.setItem("userId", data.uid); 
      // sendOTP();  
      window.location.replace("/my_account.html");
    }else{
      alert('Account Not found');  
    }
  })

}

function validEmail(email) {   
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
  return emailPattern.test(email);  
} 

function sendOTP() {
  // Reference  
  let emailInput = document.getElementById('email').value.trim();
  sessionStorage.setItem("userEmail", emailInput);

  if (!isValidEmail(emailInput)) {  
    alert('Invalid email address. Please check and try again.');  
    return; // Exit if the email is invalid  
  }  

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
    from_name: 'Alluregold Gold Investment',
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
