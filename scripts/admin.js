import { auth, database } from './firebase.js'; 
import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  
import { ref, set, onValue, push, get, runTransaction, update  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  


// const totalUsersRef = ref(database, 'totalUsers');
// onValue(totalUsersRef, (snapshot) => {
//   const total = snapshot.val() || 0;
//   document.getElementById('total-user').textContent = total
// });
// set(totalUsersRef, 0);

const loader = document.getElementById('loader');

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, check if admin
    checkAdminStatus(user);
    return
  } else {
    // No user signed in, redirect to sign-in page
    console.log('No user signed in, redirecting to sign-in page.');
    window.location.href = 'sign-in-admin.html';
  }
});

async function checkAdminStatus(user) {
  try{
    const adminRef = ref(database, `admins/${user.uid}`);
    const adminSnapshot = await get(adminRef);
    if (!adminSnapshot.exists() || adminSnapshot.val() !== true) {
      console.log('User is not an admin:', user.uid);
      window.location.href = 'sign-in-admin.html';
    }
    // User is an admin, load the dashboard
    // console.log('Admin verified:', user.uid);
    // loader.style.display = 'none';
    fetchAndDisplayUsers();
    fetchAndDisplayTransactions();


  } catch (error) {
    console.error('Error checking admin status:', error);
    window.location.href = 'sign-in-admin.html'; // Redirect on error
  }
}



function addUser() {
  const fullname = document.getElementById('js-fullname').value;
  const username = document.getElementById('js-username').value.trim();
  const email = document.querySelector('#js-email').value;  
  const password = document.querySelector('#js-password').value;


  const countersRef = ref(database, 'counters/userDisplayId');

  runTransaction(countersRef, (currentValue) => {
    return (currentValue || 0) + 1;
  }).then((result) => {
    if (result.committed) {
      const displayId = result.snapshot.val();
      createUserWithEmailAndPassword(auth, email, password)    
      .then((userCredential) => {
        const user = userCredential.user;
        const userRef = ref(database, `users/${user.uid}`);
        return set(userRef, {
          email: email,
          displayId: displayId,
          goldBalance: 0,
          createdAt: new Date().toISOString(),
          status: 'Active'
        }).then(() => {
          console.log('User added with displayId:', displayId);
          runTransaction(totalUsersRef, (currentValue) => {
            return (currentValue || 0) + 1;
          }).then(() => {
            console.log('Total users updated');
          }).catch((error) => {
            console.error('Error updating total users:', error);
          });
          console.log('User added with displayId:', displayId);
          fetchAndDisplayUsers();
        });    
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
    }else {
      console.log('Transaction not committed');
    }
  }).catch((error) => {
    console.error('Error in transaction:', error);
  });
}

function addTransaction (userId, amount, type, date) {
  const userBalanceRef = ref(database, `users/${userId}/goldBalance`);
  const transactionsRef = ref(database, `users/${userId}/transactions/`);

  runTransaction(userBalanceRef, (currentBalance) => {
    const amountNum = parseFloat(amount);
    if (type === 'deposit') {
      return (currentBalance || 0) + amountNum;
    }else if (type === 'withdraw') {
      if ((currentBalance || 0) >= amountNum) {
        return currentBalance - amountNum;
      } else {
        return;
      }
    }else {
      console.error('Invalid transaction type');
      return currentBalance; // No change
    }
  }).then((result) => {
    if (result.committed) {

      const newTransactionRef = push(transactionsRef);
      const transactionData = {  
        amount: amount,  
        type: type,  
        date: date,  
        createdAt: new Date().toISOString() 
      }; 
      set(newTransactionRef, transactionData)
      .then(() => {
        console.log('Transaction added successfully');
        fetchAndDisplayTransactions();
      })
      .catch((error) => {
        console.error('Error adding transaction: ', error);
      });
    } else{
      if(type === 'withdraw') {
        console.error('Insufficient balance for withdrawal');
        alert('Not enough gold balance.');
      }else {
        console.error('Transaction not committed');
      }
    }
  }).catch((error) => {
    console.error('Error in transaction: ', error);
  });
}

function populateUserSelected(){
  const userSelect = document.getElementById('user-select');
  const usersRef = ref(database, 'users/');

  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    userSelect.innerHTML = '<option value="">-- Select User --</option>';
    if(users){
      Object.keys(users).forEach(userId => { 
        const user = users[userId]; 
        const option = document.createElement('option');
        option.value = userId;
        option.textContent = user.email;
        userSelect.appendChild(option);
      })
    }
  })
}


function fetchAndDisplayUsers(){
  const userListElement = document.getElementById('user-list');  
  
  const usersRef = ref(database, 'users/');
  
  onValue(usersRef, (snapshot) => { 
    userListElement.innerHTML = ''; 
    const users = snapshot.val(); 
    if (users) {  
      // let userCounter = 1; 
      Object.keys(users).forEach(key => {  
        const user = users[key]; 
        const createdDate = new Date(user.createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };  
        const formattedDate = createdDate.toLocaleDateString(undefined, options);

        // Create a new table row  
        const row = document.createElement('tr');
        row.dataset.userId = key; // Store user ID
        row.innerHTML=`
          <td>
            <div class="user-id">
              <i class="fa-regular fa-user" style="color: rgba(196,138,0,1);"></i>
              <div>
                <h4>${user.username}</h4>
                <p>ID: ${user.email}</p>
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

        row.addEventListener('click', () => {
          const userId = row.dataset.userId;
          openEditUserForm(userId)
        });
        // Append the new row to the user list  
        userListElement.appendChild(row);
      })
    }else {  
      // Handle case where no users exist  
      userListElement.innerHTML = '<tr><td colspan="3">No users found.</td></tr>';  
    }
  })
}
 

async function fetchAndDisplayTransactions() {  
  const transactionBody = document.getElementById('transaction-body');  
  
  transactionBody.innerHTML = ''; 

  const adminUid = "oKmtt5pApHZqDjSyCp3uO1Y2gHJ2"; 
  set(ref(database, `admins/${adminUid}`), true)
  .then(() => console.log("Admin UID added"))
  .catch((error) => console.error("Error adding admin UID:", error));


  // console.log('Current user:', adminUid); 
  if (!adminUid) {
    transactionBody.innerHTML = '<tr><td colspan="4">Please log in as an admin to view transactions.</td></tr>';
    console.log("No user logged in. Please log in as an admin.");
    return; 
  }

  // console.log('Logged-in user UID:', adminUid);

  try{
    const usersSnapshot = await get(ref(database, 'users/')); 
    if (usersSnapshot.exists()) {  
      const users = usersSnapshot.val(); 
      let globalCounter = 1; 
      for (const userId in users) {  
        const user = users[userId];
        const userTransactionsSnapshot = await get(ref(database, `users/${userId}/transactions/`));  
        if (userTransactionsSnapshot.exists()) {  
          const transactions = userTransactionsSnapshot.val();  
          for (const transactionId in transactions) {  
            const transaction = transactions[transactionId];  
            const row = document.createElement('tr');
            row.innerHTML = `  
              <td>  
                <div class="user-id">  
                  <i class="fa-regular fa-credit-card" style="color: rgba(196,138,0,1);"></i>  
                  <div>  
                    <h4>${transaction.amount + 'kg'}</h4>  
                    <p>Transaction #${globalCounter}</p>  
                  </div>  
                </div>  
              </td>  
              <td class="created">  
                <p>${transaction.type}</p>  
              </td>  
              <td class="created">  
                <p> ${user.email}</p>  
              </td>  
              <td>  
                <div class="active-div">  
                  <i class="fa-solid fa-calendar-days"></i>  
                  <p>${transaction.date}</p>  
                </div>  
              </td>  
              <td>  
                <div class="active-div">  
                  <i class="fa-solid fa-trash-can" style="color: red"></i>
                </div>  
              </td>  
           `; 
           transactionBody.appendChild(row);  
           globalCounter++ 
          }
        }
      } 
    }else {  
      transactionBody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';  
    }  
  } catch (error) {  
    console.error('Error fetching transactions:', error);  
  } 
  
  // onValue(transactionsRef, (snapshot) => {  
  //   const transactions = snapshot.val();  
  //   console.log('Received transactions:', transactions); 
  //   if (transactions) {  
  //     let transactionCounter = 1;  
  //     Object.keys(transactions).forEach(transactionId => {   
  //       const transaction = transactions[transactionId];  

  //       const row = document.createElement('tr');  
  //       row.innerHTML = `  
  //         <td>  
  //           <div class="user-id">  
  //             <i class="fa-regular fa-credit-card" style="color: rgba(196,138,0,1);"></i>  
  //             <div>  
  //               <h4>${transaction.amount}</h4>  
  //               <p>${transaction.remark}</p>  
  //             </div>  
  //           </div>  
  //         </td>  
  //         <td class="created">  
  //           <p>${transaction.remark}</p>  
  //         </td>  
  //         <td class="created">  
  //           <p>User ID: ${transactionCounter}</p>  
  //         </td>  
  //         <td>  
  //           <div class="active-div">  
  //             <i class="fa-solid fa-calendar-days"></i>  
  //             <p>${new Date(transaction.createdAt).toLocaleString()}</p>  
  //           </div>  
  //         </td>  
  //       `;  
  //       transactionBody.appendChild(row);   
  //       transactionCounter++;  
  //     });  
  //   } else {  
  //     transactionBody.innerHTML = '<tr><td colspan="4">No transactions found for this user.</td></tr>';  
  //     console.log('No transactions found.'); // Additional logging  
  //   }  
  // }, (error) => {  
  //   console.error('Error fetching transactions:', error);  
  // });  
} 


async function openEditUserForm(userId) {
  try{
    const userSnapshot = await get(ref(database, `users/${userId}`));
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      document.getElementById('js-user-email').value = userData.email;
      document.getElementById('js-user-balance').value = userData.goldBalance;
      document.querySelector('#update-user-form .password-container p').textContent = `Current balance: ${userData.goldBalance || 0} kg`;
      document.getElementById('update-user-overlay').style.display = 'flex';
      document.getElementById('update-user-overlay').style.opacity = '1';
      document.getElementById('update-user-overlay').dataset.userId = userId;

    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}


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

  const updateCancelIcon  = document.getElementById('js-cancle-update-btn')
  const updateUserForm = document.getElementById('update-user-overlay');

  updateCancelIcon.addEventListener('click', () => {
    updateUserForm.style.opacity = '0';
    updateUserForm.style.display = 'none';
  })


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
    const type = document.getElementById('transaction-type').value;
    const date = document.getElementById('date-input').value

    if (userId && amount && type && date) {  
      addTransaction(userId, amount, type, date);
    }else{
      console.error('Please fill out all fields correctly.');
    }

    document.getElementById('add-transaction-form').reset(); 
    
    document.getElementById('add-transaction-overlay').style.display = 'none'; 


  });

  populateUserSelected();
  fetchAndDisplayTransactions(); 


  updateUserForm.addEventListener('submit', async(e) => {
    e.preventDefault()
    const overlay = document.getElementById('update-user-overlay');
    const userId = overlay.dataset.userId;
  
    const newBalance = parseFloat(document.getElementById('js-user-balance').value);
  
    // Validate the balance
    if (isNaN(newBalance)) {
      console.error('Invalid balance');
      return;
    }

    try{
      const userRef = ref(database, `users/${userId}/`);
      await update(userRef, { goldBalance: newBalance });
      console.log('User balance updated successfully');
  
      document.getElementById('update-user-form').reset();
      document.getElementById('update-user-overlay').style.display = 'none';
      document.getElementById('update-user-overlay').style.opacity = '0';
      delete document.getElementById('update-user-overlay').dataset.userId; // Clean up
    }catch (error) {
      console.error('Error updating user balance:', error);
    }
  })

  // delete pop up 
  document.getElementById('delete-btn').addEventListener('click', () => {
    updateUserForm.style.opacity = '1';
    updateUserForm.style.display = 'flex';
    document.getElementById('delete-user-overlay').style.display = "flex"
    document.getElementById('delete-user-overlay').style.opacity = '1'
  })
  
});  