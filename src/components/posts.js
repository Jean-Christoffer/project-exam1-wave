import FetchHelper from "./fetchHelper.js";

const loader = document.querySelector('.spinner')
const postSection = document.querySelector('.post-section')
const category = document.querySelector('.category')
const loadMore = document.querySelector('.load-more')
const sortDate  = document.querySelector('.sort-date')

const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('#search')

let pages = 9
let blogPosts = []
let total = 0
let categoriesArr = []

  async function getCategory(){
    const API = new FetchHelper(`${import.meta.env.VITE_API_KEY2}`)
    const response = await API.get(`categories`)
    const categories = await response.json()
    categoriesArr.push(...categories)
    return categoriesArr
  }

  getCategory()

async function getData(categoryValue = '', searchQuery =''){
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}`)
        let response
        if(searchQuery !== ''){
          response  = await API.get(`?_embed&search=${searchQuery}`)
        }
        else {
          response = await API.get(`?_embed${categoryValue ? categoryValue : ''}&orderby=date&order=desc&per_page=${pages}`)    
        }       
        const data = await response.json();
        total = response.headers.get('x-wp-total');
        return [data, total]
    }catch(error){
        console.log(error)
    }
}

 function renderHTML(data, totalPosts){

     blogPosts = data

    const total = Number.parseInt(totalPosts,10)
    const postArr = Number.parseInt(data.length,10)
    postSection.textContent = ''

    loadMore.addEventListener('click',  () => {
        if (postArr < total) {
          pages += 3;
          
          renderPage();
        } 
      });
      if(postArr === total){
        loadMore.style.display = 'none'
      }else{
        loadMore.style.display = 'block'
      }

       
    blogPosts.map( post => {


                const formatedText = post.excerpt.rendered
                const parser = new DOMParser();
                const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild;
                const formattedFinal = formatedElement.textContent;

                const articleContainer = document.createElement('div')
                articleContainer.className = 'article-container'
                
                const imgContainer = document.createElement('div')
                imgContainer.className = 'posts-img-container'
                const articleImg = document.createElement('img')
                articleImg.src = `${post._embedded['wp:featuredmedia'][0].source_url}`
                imgContainer.append(articleImg)

                const titleContainer = document.createElement('div')
                titleContainer.className = 'article-title-container'

                const postTitle = document.createElement('a')
                postTitle.textContent = post.title.rendered
                postTitle.className = 'title-link'
                postTitle.href=`details.html?id=${post.id}`

                const postArticle = document.createElement('p')
                postArticle.textContent = formattedFinal
                postArticle.className = 'subTitle-text'

                titleContainer.append(postTitle,postArticle)
                articleContainer.append(imgContainer, titleContainer)            
                postSection.append(articleContainer)
            });       

}
//filter
category.addEventListener('change',()=>{
    let found = categoriesArr.find(item => item.name === category.value)
    found ? renderPage(`&categories=${found.id || ''}`,'') : renderPage('','')
})

sortDate.addEventListener('change', () => {
  let sortedValue

  if(sortDate.value === 'oldest'){
    sortedValue = blogPosts.slice().sort((a, b) =>  new Date(a.date) - new Date(b.date) );
    
  }
  if(sortDate.value === 'newest'){
    sortedValue= blogPosts.slice().sort((a, b) =>   new Date(b.date) - new Date(a.date) );
 
  }
  renderHTML(sortedValue,'');
});


//search
searchForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  search(searchInput.value)
})
function search(cleaner){
    const trimmed = cleaner.trim()
    const urlConvert = encodeURIComponent(trimmed);
    renderPage('',urlConvert)
}



async function renderPage(categoryValue = '', searchQuery = ''){
    try{
        loader.classList.add('show')
        console.log(categoryValue)

        const [data, totalPosts ]= await getData(categoryValue,searchQuery) 
        renderHTML(data,totalPosts)

    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
    }
}

window.addEventListener('load',() => {
  category.value = ''
  sortDate.value = 'newest'
})
renderPage()
