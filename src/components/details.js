import FetchHelper from "./fetchHelper.js";
import showSnackBar from "./snackBar.js";
const loader = document.querySelector('.spinner')

const queryString = document.location.search;
const params  = new URLSearchParams(queryString);
const id = params.get("id");

const selectors =
[
    '.blog-title',
    '.blog-container',
    '.date',
    '.author',
    'form',
    '.input-field-name',
    '.input-field-comment',
    '.article-header',
    '.comment-field',
    '.comment-count',
    '.snackbar-wrapper',
    '#comment-btn',
    '.modal',
    '.modal-img',
    '.modal-btn',
]
const mapSelect = selectors.map(element => document.querySelector(element))
const 
[
    blogTitle,
    blogContainer,
    date,
    author,
    form,
    authorName,
    comment, 
    articleHeader,
    commentField,
    commentCount,
    snackbarWrapper,
    commentButton,
    modal,
    modalImg,
    modalBtn,

] = mapSelect

async function getData(param){
    try{
        const API = new FetchHelper(`https://wave.jeandahldev.no/wp-json/wp/v2/posts/${param}`)
        const response = await API.get(`?_embed`)
        const data = await response.json(); 
     

        return data


    }catch(error){
        console.log(error)
    }
}

form.addEventListener('submit', async function(e) {
    e.preventDefault()

    const nameValue = authorName.value.toLowerCase().trim()
    const commentValue = comment.value.toLowerCase().trim()

    if( nameValue.length > 0  &&  commentValue.length > 0){
        try{
            commentButton.disabled = true
            const API = new FetchHelper(`https://wave.jeandahldev.no/wp-json/wp/v2/`)
            const post = await API.post(`comments?post=${id}`,{
                "post": id,
                "author_name": `${authorName.value}`,
                "content": `${comment.value}`
            })
            console.log(post)
    
    
        } catch(error){
            console.log(error)
        }finally{
    
            commentButton.disabled = false
            authorName.value = ''
            comment.value =''
            showSnackBar(snackbarWrapper, 'Success! comment pending approval')
    
        }
    
    }
    
})

const inputBorders = [authorName, comment]
inputBorders.forEach(el => el.addEventListener('input',inputBorderCheck))
function inputBorderCheck() {

    authorName.value.length > 0 ? authorName.style.border = '1px solid #5cd55c' : authorName.style.border = '1px solid #ddd'
    comment.value.length > 0 ? comment.style.border = '1px solid #5cd55c' : comment.style.border = '1px solid #ddd'

  }

async function getComments(){
    try{
        const API = new FetchHelper(`https://wave.jeandahldev.no/wp-json/wp/v2/`)
        const response = await API.get(`comments?post=${id}&orderby=date&order=asc`)
        const comments = await response.json()

        return comments


    } catch(error){
        console.log(error)
    }
}

function renderHtml(data,comments = ''){

    const formatedText = data.content.rendered
    const parser = new DOMParser();
    const nodes = parser.parseFromString(formatedText, 'text/html').body.childNodes

    
        nodes.forEach(element => {
            const paragraph = document.createElement('p')
            paragraph.className = 'paragraph-text'
            paragraph.textContent =  element.textContent
            return blogContainer.append(paragraph) 
        })

        comments.forEach(comment => {
            const formatedText = comment.content.rendered
            const parser = new DOMParser();
            const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild.textContent;

            const commentContainer = document.createElement('div')
            commentContainer.classList = 'comment-container'

            const comments = document.createElement('p')
            comments.textContent = formatedElement

            const commentAuthor = document.createElement('h4')
            commentAuthor.textContent = comment.author_name

            const dateWritten = document.createElement('small')
            const newDate = new Date(comment.date)
            
            const getDay = newDate.getDate()
            const getMonth = newDate.getMonth() + 1
            const getYear = newDate.getFullYear()
        
            let formatedMonth
            let formatedDay
            
            getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
            getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
            dateWritten.textContent = `Published: ${formatedDay}.${formatedMonth}.${getYear}`
            commentContainer.append(dateWritten, commentAuthor,comments)
            return commentField.append(commentContainer)
       
         })

    articleHeader.style.backgroundImage = `url(${data._embedded['wp:featuredmedia'][0].source_url})`


    blogTitle.textContent =  data.title.rendered
    author.textContent = `Author: ${data._embedded.author[0].name}`
    document.title = `WAVE || ${data.title.rendered}`
    
    modalImg.src = data._embedded['wp:featuredmedia'][0].source_url
    modalImg.alt = data._embedded['wp:featuredmedia'][0].alt_text
    
    const newDate = new Date(data.date)
    

    const getDay = newDate.getDate()
    const getMonth = newDate.getMonth() + 1
    const getYear = newDate.getFullYear()

    let formatedMonth
    let formatedDay
    
    getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
    getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
    date.textContent =`Published: ${formatedDay}.${formatedMonth}.${getYear}`

    commentCount.textContent = `Comments (${comments.length})`

}


articleHeader.addEventListener('click',()=>{
    modal.showModal()
    
    const body = document.querySelector('body')
    body.classList.add('stop-scrolling')
})

modalBtn.addEventListener('click',()=> {
    modal.close()
    const body = document.querySelector('body')
    body.classList.remove('stop-scrolling')
})

const dialog = document.querySelector('dialog');
dialog.addEventListener("click", (event) => {

    if (event.target === dialog) {
   
      dialog.close();
      const body = document.querySelector('body')
      body.classList.remove('stop-scrolling')
    }
  });
  

async function renderPage(){
    try{
        loader.classList.add('show')
        const data = await getData(id)
        const comments = await getComments()
        renderHtml(data,comments)
    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
    }
}
window.addEventListener('load',inputBorderCheck)
renderPage()