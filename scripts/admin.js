import { auth, database } from './firebase.js'; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  
import { ref, set, onValue, push  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  

function addUser() {
  const email = document.querySelector('#js-email').value;  
  const password = document.querySelector('#js-password').value;  

  // Reference to users in the database  
  const usersRef = ref(database, 'users/');  

  // Fetch the current users to determine the next user ID  
  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();  
    let nextId = 1;  
    
    if (users) {  
      // Find the maximum ID currently used  
      const userIds = Object.keys(users).map(id => parseInt(id));  
      // Find the next available ID  
      nextId = Math.max(...userIds) + 1; 

      // localStorage.setItem("userName", data.name)
      // localStorage.setItem("userChackings", users[userid].checking);
      // sessionStorage.setItem('isLoggedIn', false);
    }  
        
    createUserWithEmailAndPassword(auth, email, password)    
    .then((userCredential) => {
      const user = userCredential.user;
  
      const userDetails = {  
        email: email,  
        uid: nextId.toString(), 
        createdAt: new Date().toISOString(), 
        status: 'Active'  
      };   
  
      return set(ref(database, 'users/' + user.uid), userDetails);  
    })
    .then(() => {  
      // console.log('User added to database successfully'); 
      fetchAndDisplayUsers(); 
    })  
    .catch((error) => {  
      console.error('Error adding user: ', error);  
    });
  })
}
function addTransaction (userId, amount, remark, date) {
  const transactionsRef = ref(database, `users/${userId}/transactions/`); 

  const newTransactionRef = push(transactionsRef);
  const transactionData = {  
    amount: amount,  
    remark: remark,  
    date: date,  
    createdAt: new Date().toISOString() 
  }; 

  return set(newTransactionRef, transactionData)
  .then(() => {  
    console.log('Transaction added successfully');  
    populateUserSelected();
    fetchAndDisplayTransactions(userId);
  })  
  .catch((error) => {  
    console.error('Error adding transaction: ', error);  
  });
}

function populateUserSelected(){
  const userSelect = document.getElementById('user-select');
  const usersRef = ref(database, 'users/');

  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();

    if(users){
      Object.keys(users).forEach(userId => { 
        const user = users[userId]; 
        const option = document.createElement('option');
        option.value = user.uid;
        option.textContent = user.email;
        userSelect.appendChild(option);
      })
    }
  })
}


function fetchAndDisplayUsers(){
  const userListElement = document.getElementById('user-list');  
  userListElement.innerHTML = ''; 

  const usersRef = ref(database, 'users/');

  onValue(usersRef, (snapshot) => { 
    const users = snapshot.val(); 
    if (users) {  
      let userCounter = 1; 
      Object.keys(users).forEach(userId => {  
        const user = users[userId]; 
        const createdDate = new Date(user.createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };  
        const formattedDate = createdDate.toLocaleDateString(undefined, options);

        // Create a new table row  
        const row = document.createElement('tr');

        row.innerHTML=`
          <td>
            <div class="user-id">
              <i class="fa-regular fa-user" style="color: rgba(196,138,0,1);"></i>
              <div>
                <h4>${user.email}</h4>
                <p>ID: ${userCounter}</p>
              </div>
            </div>
          </td>

            <td class="created">
            <p>${formattedDate}</p>
          </td>

          <td>
            <div class="active-div">
              <div class="${user.status === 'Active' ? 'active-circle' : 'not-active-circle'}"></div>  
              <p>${user.status === 'Active' ? 'Online' : 'Offline'}</p>  
            </div>
          </td>
        `;

        // Append the new row to the user list  
        userListElement.appendChild(row);
        userCounter++;  
      })
    }else {  
      // Handle case where no users exist  
      userListElement.innerHTML = '<tr><td colspan="3">No users found.</td></tr>';  
    }
  })
}

// auth.onAuthStateChanged((user) => {  
//   if (user) {  
//       console.log('User is signed in:', user.uid);  
//       fetchAndDisplayTransactions(user.uid); 
//   } else {  
//       console.log('No user is signed in. Cannot fetch transactions.');  
//   }  
// }); 

function fetchAndDisplayTransactions(userId) {  
  const transactionBody = document.getElementById('transaction-body');  
  
  transactionBody.innerHTML = ''; // Clear the content  

  const transactionsRef = ref(database, 'users/' + userId + '/transactions/');   
  onValue(transactionsRef, (snapshot) => {  
    const transactions = snapshot.val();  
    console.log('Received transactions:', transactions); 
    if (transactions) {  
      let transactionCounter = 1;  
      Object.keys(transactions).forEach(transactionId => {   
        const transaction = transactions[transactionId];  

        const row = document.createElement('tr');  
        row.innerHTML = `  
          <td>  
            <div class="user-id">  
              <i class="fa-regular fa-credit-card" style="color: rgba(196,138,0,1);"></i>  
              <div>  
                <h4>${transaction.amount}</h4>  
                <p>${transaction.remark}</p>  
              </div>  
            </div>  
          </td>  
          <td class="created">  
            <p>${transaction.remark}</p>  
          </td>  
          <td class="created">  
            <p>User ID: ${transactionCounter}</p>  
          </td>  
          <td>  
            <div class="active-div">  
              <i class="fa-solid fa-calendar-days"></i>  
              <p>${new Date(transaction.createdAt).toLocaleString()}</p>  
            </div>  
          </td>  
        `;  
        transactionBody.appendChild(row);   
        transactionCounter++;  
      });  
    } else {  
      transactionBody.innerHTML = '<tr><td colspan="4">No transactions found for this user.</td></tr>';  
      console.log('No transactions found.'); // Additional logging  
    }  
  }, (error) => {  
    console.error('Error fetching transactions:', error);  
  });  
}   

// function fetchAndDisplayTransactions(userId) {  
//   console.log("Fetching transactions for user ID:", userId);  

//   const transactionBody = document.getElementById('transaction-body');   
//   // const userEmail = document.getElementById('selected-user-email');  
//   // const userIdDisplay = document.getElementById('selected-user-id');  

//   transactionBody.innerHTML = '';

//   // const userRef = ref(database, `users/${userId}`);   

//   // // Fetch user details  
//   // onValue(userRef, (snapshot) => {  
//   //   const user = snapshot.val();  
//   //   if (user) {  
//   //     userEmail.textContent = `Email: ${user.email}`;  
//   //     userIdDisplay.textContent = `User ID: ${userId}`;  
//   //   }  
//   // }, (error) => {  
//   //   console.error('Error fetching user details:', error);  
//   // });  

//   const transactionsRef = ref(database, `users/${userId}/transactions/`);    
//   // Fetch transactions  
//   onValue(transactionsRef, (snapshot) => {  
//     const transactions = snapshot.val();  
//     console.log(transactions)
//     if (transactions) {  
//       let transactionCounter = 1;  
//       Object.keys(transactions).forEach(transactionId => {   
//         const transaction = transactions[transactionId];  
//         const row = document.createElement('tr');  

//         row.innerHTML = `  
//           <td>  
//             <div class="user-id">  
//             <i class="fa-regular fa-credit-card" style="color: rgba(196,138,0,1);"></i>  
//             <div>  
//               <h4>${transaction.amount}</h4>  
//               <p>Transaction #${transactionCounter}</p> <!-- Display the transaction counter -->  
//             </div>  
//             </div>  
//           </td>  

//           <td class="created">  
//             <p>${transaction.remark}</p>  
//           </td>  

//           <td class="created">
//             <p>User ID: 2</p>
//           </td>

//           <td class="created">  
//             <p>${transaction.date}</p> <!-- Display the date of the transaction -->  
//           </td>  

//           <td>  
//             <div class="active-div">  
//               <i class="fa-solid fa-calendar-days"></i>  
//               <p>${new Date(transaction.createdAt).toLocaleString()}</p>  
//             </div>  
//           </td>  
//         `;  

//         transactionBody.appendChild(row);   
//         transactionCounter++; 
//       });  
//     } else {  
//       transactionBody.innerHTML = '<tr><td colspan="4">No transactions found for this user.</td></tr>';  
//     }  
//   }, (error) => {  
//     console.error('Error fetching transactions: ', error);  
//   });  
// }  



document.addEventListener('DOMContentLoaded', () => {  
  const addUserButton = document.querySelector('.add-btn');  
  const addTransactionButton = document.querySelector('.transaction-btn');  
  
  // display Add user form
  const displayAddUserForm = document.getElementById('add-user-overlay');
  addUserButton.addEventListener('click', () => {  
    displayAddUserForm.style.opacity = '1';
    displayAddUserForm.style.display = 'flex';

  }); 

  // display Transaction form 
  const displayTransactionForm = document.getElementById('add-transaction-overlay');
  addTransactionButton.addEventListener('click', () => {  
    displayTransactionForm.style.opacity = '1';
    displayTransactionForm.style.display = 'flex';
  }); 

  // Cancel icons 
  const cancelIcon = document.getElementById('js-cancle-btn');
  cancelIcon.addEventListener('click', () => {
    displayAddUserForm.style.opacity = '0';
    displayAddUserForm.style.display = 'none';
  });
  
  const cancelIconTrans = document.getElementById('js-cancle-trans-btn');
  cancelIconTrans.addEventListener('click', () => {
    displayTransactionForm.style.opacity = '0';
    displayTransactionForm.style.display = 'none';
  });


  // cancel buttons 
  const cancelBtn = document.getElementById('cancel-btn');
  cancelBtn.addEventListener('click', () => {
    displayAddUserForm.style.opacity = '0';
  });

  const transCancelBtn = document.getElementById('trans-cancel-btn');
  transCancelBtn.addEventListener('click', () => {
    displayTransactionForm.style.opacity = '0';
  });


  // Add users form admin
  const userForm = document.querySelector('#add-user-form');
  
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#js-email').value;  
    const password = document.querySelector('#js-password').value;    
    // alert('clicked')
    addUser(email, password);
    document.getElementById('add-user-form').reset(); 
    
    document.getElementById('add-user-overlay').style.display = 'none'; 
  })
  fetchAndDisplayUsers()  

  // Add users Transaction 
  const transactionForm = document.getElementById('add-transaction-form');



  transactionForm.addEventListener('submit' , (e) => {
    e.preventDefault()
    
    const userSelect = document.getElementById('user-select');  
    const userId = userSelect.value;
    const amount = document.getElementById('num-input').value;
    const remark = document.getElementById('remark-input').value;
    const date = document.getElementById('date-input').value

    if (userId && amount && remark && date) {  
      addTransaction(userId, amount, remark, date);
    }else{
      console.error('Please fill out all fields correctly.');
    }

    document.getElementById('add-transaction-form').reset(); 
    
    document.getElementById('add-transaction-overlay').style.display = 'none'; 


  });
  const userSelect = document.getElementById('user-select');
  const userId = userSelect.value;

  // populateUserSelected();
  fetchAndDisplayTransactions(userId);
});  