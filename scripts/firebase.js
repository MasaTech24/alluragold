import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  
import { getDatabase} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  


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
const auth = getAuth(app);  
const database = getDatabase(app); 
export { auth, database };


// class ChildrenNode {  
//   constructor(value) {  
//       this.value = value; // Store data for the node  
//       this.children = []; // Children nodes  
//   }  

//   // Modified equals function with a visited Set to handle recursion  
//   equals(other, visited = new Set()) {  
//       if (this === other) return true; // Reference check  
//       if (!(other instanceof ChildrenNode)) return false; // Type check  
      
//       // Prevent circular references  
//       if (visited.has(this) || visited.has(other)) return false;  
      
//       visited.add(this); // Mark this node as visited  
//       visited.add(other); // Mark the other node as visited  

//       // Compare values  
//       if (JSON.stringify(this.value) !== JSON.stringify(other.value)) return false;  

//       // Compare children count  
//       if (this.children.length !== other.children.length) return false;  

//       // Recursively check equality for each child  
//       for (let i = 0; i < this.children.length; i++) {  
//           if (!this.children[i].equals(other.children[i], visited)) {  
//               return false; // If any child doesn't match  
//           }  
//       }  

//       return true; // All checks passed, nodes are equal  
//   }  

//   // Function to add a child  
//   addChild(child) {  
//       if (child instanceof ChildrenNode) {  
//           this.children.push(child);  
//       }  
//   }  
// }  

// const rootNode = new ChildrenNode({ name: "Root" });  
// const childNode1 = new ChildrenNode({ name: "Child 1" });  
// const childNode2 = new ChildrenNode({ name: "Child 2" });  

// rootNode.addChild(childNode1);  
// rootNode.addChild(childNode2);  

// console.log(rootNode.equals(rootNode)); // Should return true  
// console.log(rootNode.equals(new ChildrenNode({ name: "Root" }))); // Should return false  
  
