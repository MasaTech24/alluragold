import { database } from './firebase.js';

import { ref, onValue} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  ;

// const userName = localStorage.getItem("userName");
// const Name = document.getElementById("name");
// Name.textContent = userName;
const userId = localStorage.getItem("userId");

// console.log(userId)


// function SavingsBalanceChanges(userId) {
//   console.log(`Savings balance for User ID: ${userId}`);  
//   const userRef = ref(database, 'users/' + userId + '/saving');
//   onValue(userRef, (snapshot) => {
//     const savingBalance = snapshot.val();
//     if(savingBalance !== null){
//       const formattedBalance = '$ ' + savingBalance.toFixed(2);
//       console.log(formattedBalance)
//       document.getElementById('saving').textContent
//       = formattedBalance
//     } else {
//       document.getElementById('saving').textContent = 'Unavaible';
//     }
//   });
// }
// SavingsBalanceChanges(userId);




const signOutBtnn = document.querySelector('.js-sign-out');
signOutBtnn.addEventListener('click', () => {
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userChackings");
  sessionStorage.removeItem("userSavings");
  window.location.replace('/MB-Finance/index');
  sessionStorage.removeItem('isLoggedIn');
})

document.addEventListener('DOMContentLoaded', () => { 
  const user = userId;  
  console.log('User signed in: ', user);

  if(user){
    const userRef = ref(database, 'users/' + user);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();  
      if (data) {
        // console.log(data.email)
        document.getElementById('js-user-email').textContent = data.email; 
        document.getElementById('js-checking').textContent = data.goldBalance + " kg";
        RenderTranasationList(data.uid);  
      }else {  
        console.log('No user data found.');   
        window.location.href = "sign-in.html";  
      } 
    })
  } else {  
    console.log('No user is signed in.');   
    window.location.href = "sign-in.html";   
  } ;
});

function GoldBalanceChanges(userId) {
  const userRef = ref(database, 'users/' + userId + '/goldBalance');  
  onValue(userRef, snapshot => {  
    const currentBalance = snapshot.val();
    if(currentBalance !== null){
      document.getElementById('js-checking').textContent = currentBalance + " kg";
   }else{
      document.getElementById('js-checking').textContent = 'Unavailable';
    }
  });
}
GoldBalanceChanges(userId);


function RenderTranasationList(userId) {
  const transactionRef = ref(database, 'users/' + userId + '/transactions/');
  onValue(transactionRef, (snapshot) => {
    const transactions = snapshot.val();
    const transactionList = document.getElementById('js-transaction');
    transactionList.innerHTML = '';
    if(transactions){
      for (const key in transactions) {
        const transaction = transactions[key];
        transactionList.innerHTML += `
          <div class="transactions-lists ">
            <div class="product-item">
              <div>${transaction.name}</div>
              <p>${transaction.date}</p>
            </div>
            <div class="amount-div">
              <div>-${transaction.amount}</div>
            </div> 
          </div>
        `
      }
    } else {  
      transactionList.innerHTML = `
        <div class="transactions-lists ">
          <p>No transactions found.</p>
        </div>
      `;  
    }  
  })
}
RenderTranasationList(userId);



