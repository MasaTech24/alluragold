import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js"; 

import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  


const firebaseConfig = {
  apiKey: "AIzaSyCYKG_aEnj91X31MRdEP12o4vXMmc0Um0g",
  authDomain: "assetsinvest-bfadb.firebaseapp.com",
  projectId: "assetsinvest-bfadb",
  storageBucket: "assetsinvest-bfadb.firebasestorage.app",
  messagingSenderId: "670510674666",
  appId: "1:670510674666:web:f84306aa1be3eb538f9d93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let users = {
  Ricard_Haernandez: {
    id: 'Ricard_Harnandez',
    name: 'Richard Hernandez',
    email: 'hr7070445@gmail.com',
    password: 'Ricardhar@5',
    checking: 760500/100,
    saving: 300000/100,
  },
  Bailey_Kay: {
    id: 'Bailey_Kay',
    name: 'Bailey Kay',
    email: 'baileykayx76@gmail.com',
    password: 'password456',
    checking: 50000/100,
    saving: 10000 / 100,
  },
  Karen_Noxy: {
    id: 'Karen_Noxy',
    name: 'Leo Grayson',
    email: 'leograyson1969@gmail.com',
    password: 'password00',
    checking: 30000/100,
    saving: 1000/100,
  },
};
export default users;

document.addEventListener('DOMContentLoaded', () => {
  const signInBtn = document.getElementById('sign-btn');
  const passwordInp = document.getElementById('password'); 
  signInBtn.addEventListener('click', () => {
    const password = passwordInp.value;
    signIn(password);
  })
});
function signIn(password){
  localStorage.setItem("userpassword", password);
  let emailInput = document.getElementById('email').value;
  // const password = document.getElementById('password').value; 

  for (let userid in users) {
    if (users[userid].email === emailInput) {
      if( users[userid].password === password){
        // alert('Sign in successful!');
        signInAnonymously(auth)
        .then(() => {
          console.log('Anonymous authentication successful.')
        })
        .catch((error) => {
          console.error('Anonymous authentication failed:', error);
        });
        const userRef = ref(database, 'users/' + userid);  

        onValue(userRef, (snapshot) => {
          snapshot.val();
          // const data = snapshot.val();
          // console.log(data);
        });
        push(userRef, users[userid])
        .then(() => {
          // console.log("User saved successfully!");
        }).catch((error) => {
          console.error("Error saving user:", error);
        });
        document.querySelector('#sign-btn').innerHTML = 'Please wait...';
        sessionStorage.setItem('isLoggedIn', true);
        localStorage.setItem("userName", users[userid].name);
        localStorage.setItem("userId", users[userid].id);
        localStorage.setItem("userChackings", users[userid].checking);
        localStorage.setItem("userSavings", users[userid].saving);
        sendOTP();
        return true;
      }else{
        alert('Wrong password')
        return false;
      }
    }
  } 
  alert('Email not found');
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
