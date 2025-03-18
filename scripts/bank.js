import { initializeApp} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  

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

const userName = localStorage.getItem("userName");
const userId = localStorage.getItem("userId");
const Name = document.getElementById("name");
Name.textContent = userName;

// console.log(userId)
function CheckingBalanceChanges(userId) {
  const userRef = ref(database, 'users/' + userId + '/checking');  
  onValue(userRef, snapshot => {
    const currentBalance = snapshot.val();
    if(currentBalance !== null){
      const formattedBalance = '$ ' + currentBalance.toFixed(2);
      document.getElementById('js-checking').textContent = formattedBalance;
   }else{
      console.log('why');
      document.getElementById('js-checking').textContent = 'Unavaible';
    }
  });
}
CheckingBalanceChanges(userId)


function SavingsBalanceChanges(userId) {
  console.log(`Savings balance for User ID: ${userId}`);  
  const userRef = ref(database, 'users/' + userId + '/saving');
  onValue(userRef, (snapshot) => {
    const savingBalance = snapshot.val();
    if(savingBalance !== null){
      const formattedBalance = '$ ' + savingBalance.toFixed(2);
      console.log(formattedBalance)
      document.getElementById('saving').textContent
      = formattedBalance
    } else {
      document.getElementById('saving').textContent = 'Unavaible';
    }
  });
}
SavingsBalanceChanges(userId);

function RenderTranasationList(userId) {
  const transactionRef = ref(database, 'users/' + userId + '/transactions/');
  onValue(transactionRef, (snapshot) => {
    const transactions = snapshot.val();
    const transactionList = document.getElementById('js-transaction');
    transactionList.innerHTML = '';
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
  })
}
RenderTranasationList(userId);


const signOutBtnn = document.querySelector('.js-sign-out');
signOutBtnn.addEventListener('click', () => {
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userChackings");
  sessionStorage.removeItem("userSavings");
  window.location.replace('/MB-Finance/index');
  sessionStorage.removeItem('isLoggedIn');
})
