function myFunction() {
  let x = document.getElementById("navLinks");
  
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
window.onload =  () => {
  const saveLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (saveLoggedIn == true) {
    console.log('logged IN')
    window.location.href = '/My_account';
  }
}

// Getstarted button fucntion 
const getStartedBtn = document.getElementById('js-get-start-btn');
getStartedBtn.addEventListener('click', () => window.location.href = 'sign-in.html');

// Contact Button function 
const contactBtn = document.getElementById('js-contact-btn');
contactBtn.addEventListener('click', () => window.location.href = 'contact.html');

// Get support function 
const supportBtn = document.getElementById('js-support-btn');
supportBtn.addEventListener('click', () => window.location.href = 'support.html');