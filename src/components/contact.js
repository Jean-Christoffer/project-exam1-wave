import showSnackBar from "./snackBar.js";

const nameInput = document.querySelector('#your-name')
const mailInput = document.querySelector('#your-email')
const subjectInput = document.querySelector('#your-subject')
const contactForm = document.querySelector('.contact-form')
const snackbarWrapper = document.querySelector('.snackbar-wrapper')
const question = document.querySelector('#your-message')

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault()
    const formData = new FormData(contactForm);

    const name = nameInput.value.trim()
    const email = mailInput.value.trim()
    const subject = subjectInput.value.trim()
    const questionValue = question.value.trim()
    const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; 
    const patternMatches = regEx.test(email);

    name.length > 5 ? removeErrorMessage(nameInput) : errorMessage(nameInput,'Please provide atleast 5 characters')
    patternMatches ? removeErrorMessage(mailInput) : errorMessage(mailInput, 'Please enter a valid email')
    subject.length > 15 ?  removeErrorMessage(subjectInput) : errorMessage(subjectInput, 'Please provide atleast 15 characters')
    questionValue.length > 25 ? removeErrorMessage(question) : errorMessage(question, 'Please provide atleast 25 characters')

    if( name.length >= 5 && patternMatches && subject.length >= 15 && questionValue.length >= 25){
        nameInput.value = ''
        mailInput.value = ''
        subjectInput.value = ''
        question.value = ''
        showSnackBar(snackbarWrapper, 'Message sendt! we will reply shortly')

        fetch(`${import.meta.env.VITE_API_KEY3}56/feedback`, {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .catch(error => {
           console.log(error)
          });

       
      }
    
})

function errorMessage(input, message){
    let error = input.parentElement.children[2]
    error.textContent = message
    error.classList.add('show')
  
  } 
function removeErrorMessage(input){
    let error = input.parentElement.children[2]
    error.classList.remove('show')
  }
  



