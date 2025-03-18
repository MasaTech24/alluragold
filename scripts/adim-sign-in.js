import { auth, database } from './firebase.js'; 
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  


// Handle form submission  
document.getElementById('adminLoginForm').addEventListener('submit', (event) => {  
  event.preventDefault();  

  const email = document.getElementById('email').value;  
  const password = document.getElementById('password').value;  

  // Sign in with email and password  
  signInWithEmailAndPassword(auth, email, password)  
    .then((userCredential) => {  
      console.log("Logged in:", userCredential.user);  
      window.location.href = "adminDb.html"; 
    })  
    .catch((error) => {  
    const errorCode = error.code;  
    const errorMessage = error.message;  
    document.getElementById('error-message').innerText = errorMessage; // display error message  
    console.error("Error during sign-in:", errorCode, errorMessage);  
  });  
});  

function checkAdmin(userId) {  
  const dbRef = ref(database, `admins/${userId}`);  
  onValue(dbRef, (snapshot) => {  
    if (snapshot.exists()) {  
      console.log("User is an admin.");  
    } else {  
      console.error("User is not an admin, redirecting...");  
      window.location.href = "unauthorized.html";   
    }  
    }, (error) => {  
      console.error('Error fetching admin status:', error);  
  });  
}  

// Call this function in your app after login  
const user = auth.currentUser;  
if (user) {  
  checkAdmin(user.uid);  
}  