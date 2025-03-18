// class login {
//   constructor(form, inputFields){
//     this.form = form;
//     this.inputFields = inputFields;
//     this.validateOnSubmit();
//   }

//   validateOnSubmit(){
//     let self = this;

//     this.form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       let error = 0;

//       self.inputFields.forEach((inputFields) => {
//         const input = document.querySelector(`#${inputFields}`);

//         if(self.validateFields(input) === false){
//           error++;
//         }

//       })
//       if(error === 0){
//         // console.log('successful');

//         // do loin api here 
//         localStorage.setItem('auth', 1);
//         window.location.replace('/')
//         this.form.submit();
//       }
//     })
//   }

//   validateFields(inputFields){
//     if(inputFields.value.trim() == ''){
//       this.setStatus(
//         inputFields,
//         `${inputFields.previousElementSibling.innerText} cannot be blank`,
//         'error'
//       )
//       return false;
//     }else {
//       if(inputFields.type === 'password'){
//         if(inputFields.value.length < 8){
//           this.setStatus(
//             inputFields,
//             `${inputFields.previousElementSibling.innerText} must be at least 8 characters`,
//             'error'
//           );
//           return false;
//         }else{
//           this.setStatus(inputFields, null, 'success');
//           return true;
//         }
//       }else{
//         this.setStatus(inputFields, null, 'success');
//         return true;
//       }
//     }
//   }

//   setStatus(inputFields, message, status){
//     const errorMessage = inputFields.parentElement.querySelector('.error-message');
//     if(status === 'success'){
//       if(errorMessage){
//         errorMessage.innerText = '';
//       }
//       errorMessage.classList.remove('error-message');
//     }

//     if(status === 'error'){
//       errorMessage.innerText = message;
//       inputFields.classList.add('error-message');
//     }
//   }
// }

// const form = document.querySelector('.js-login-form');
// if(form){
//   const inputFields = ['email', 'password'];
//   const validator = new login(form, inputFields);
// }
const signUpBtn = document.querySelector('.js-sign-in-button');
const fgtPwdLink =  document.querySelector('.fgt-pwd');

signUpBtn.addEventListener('click', ()=> {
  // sendOTP();
  alert('Service Unavailable, try again later....');
});

fgtPwdLink.addEventListener('click', ()=> {
  alert('Service Unavailable, try again later....');
});



