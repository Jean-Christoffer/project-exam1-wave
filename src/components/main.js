const selectors =
[
    '.hamburger',
    '.nav',
    '.overlay',
    'body',
    '.footer-form',
    '#email-input',
    '.snackbar-wrapper-footer',
]

const mapSelect = selectors.map(element => document.querySelector(element))

const 
[
    hamburger,
    nav,
    overlay,
    body,
    footerForm,
    emailInput,
    snackbarWrapper,

] = mapSelect

const menuItems = document.querySelectorAll('.menu_item')

import showSnackBar from "./snackBar.js";
let activeClass = false
hamburger.addEventListener('click',  () => {
  
  activeClass = !activeClass



  if(activeClass){
    hamburger.classList.add('active')
    nav.classList.add('active')
    overlay.classList.add('active')
    const body = document.querySelector('body')
    body.classList.add('stop-scrolling')
  }else{
    hamburger.classList.remove('active')
    nav.classList.remove('active')
    overlay.classList.remove('active')
    body.classList.remove('stop-scrolling')
  
  }
  menuItems.forEach(item => item.addEventListener('click', () => {
    hamburger.classList.remove('active')
    nav.classList.remove('active')
    activeClass = false
  }))
  
})

overlay.addEventListener('click',()=>{

  overlay.classList.remove('active')
  body.classList.remove('stop-scrolling')

  hamburger.classList.remove('active')
  nav.classList.remove('active')

})



footerForm.addEventListener('submit', async function(e) {
  e.preventDefault()


  const email= emailInput.value.toLowerCase().trim()
  const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; 
  const patternMatches = regEx.test(email);
  patternMatches ? (removeErrorMessage(emailInput),
  emailInput.value = '',
  showSnackBar(snackbarWrapper, 'Subscribed!')
  ) : errorMessage(emailInput, 'Please enter a valid email')
 
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
