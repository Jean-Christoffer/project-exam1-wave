const hamburger = document.querySelector('.hamburger')
const nav = document.querySelector('.nav')
const overlay = document.querySelector('.overlay')
const body = document.querySelector('body')
const menuItems = document.querySelectorAll('.menu_item')
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

