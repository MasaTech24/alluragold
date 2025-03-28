import { database } from './firebase.js';

import { ref, onValue} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  ;

const userId = localStorage.getItem("userId");

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
        document.getElementById('js-user-fullname').textContent = data.fullname; 
        document.getElementById('js-user-username').textContent = data.username; 
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
      const transactionArray = Object.entries(transactions).map(([key, value]) => ({
        key,
        ...value
      }));
      transactionArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      transactionArray.forEach((transaction) => {
        transactionList.innerHTML += `
          <div class="transactions-lists ">
            <div class="product-item">
              <div>${transaction.type}</div>
              <p>${transaction.date}</p>
            </div>
            <div class="${transaction.type === 'withdraw' ? 'amount-div' : 'incoming-amount-div'}">
              <div>${transaction.type === 'withdraw' ? '-' : '+'} ${transaction.amount + 'kg'}</div>
            </div> 
          </div>
        `
      })
      // for (const key in transactions) {
      //   const transaction = transactions[key];
      //   transactionList.innerHTML += `
      //     <div class="transactions-lists ">
      //       <div class="product-item">
      //         <div>${transaction.type}</div>
      //         <p>${transaction.date}</p>
      //       </div>
      //       <div class="${transaction.type === 'withdraw' ? 'amount-div' : 'incoming-amount-div'}">
      //         <div>${transaction.type === 'withdraw' ? '-' : '+'} ${transaction.amount + 'kg'}</div>
      //       </div> 
      //     </div>
      //   `
      // }
    } else {  
      transactionList.innerHTML = `
        <div class="transactions-lists ">
          <p>No transactions found.</p>
        </div>
      ` 
    }  
  })
}
RenderTranasationList(userId);



