import FetchHelper from "./fetchHelper.js";
import { gsap } from "gsap";
const loader = document.querySelector('.spinner')
const postSection = document.querySelector('.post-section')
const category = document.querySelector('.category')
const loadMore = document.querySelector('.load-more')
const sortDate  = document.querySelector('.sort-date')

const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('#search')

let pages = 1
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
          response = await API.get(`?_embed${categoryValue ? categoryValue : ''}&orderby=date&order=desc&page=${pages}`)    
        }       
        const data = await response.json();
        total = response.headers.get('x-wp-totalpages');
        return [data, total]
    }catch(error){
        console.log(error)
    }
}



 function renderHTML(data, totalPosts,animate = true){

    blogPosts = data
    const total = Number.parseInt(totalPosts,10)


    loadMore.addEventListener('click', async () => {
      if (pages < total) {
        pages += 1;
        renderPage('','',false)
      }
    });

      if(pages === total  || blogPosts.length === 0){
        loadMore.style.display = 'none'
      }else{
        loadMore.style.display = 'block'
      }

      if(blogPosts.length === 0){
        const noResults = document.createElement('h2')
        noResults.textContent = `No results matching "${searchInput.value}" found`
        noResults.style.textAlign = 'center'
        postSection.append(noResults)
       }

       
  
       
    blogPosts.forEach( post => {


        const formatedText = post.excerpt.rendered
        const parser = new DOMParser();
        const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild;
        const formattedFinal = formatedElement.textContent;

        const articleContainer = document.createElement('div')
        articleContainer.className = 'article-container'
        articleContainer.id = post.id
        
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

 


            if(animate){

              gsap.fromTo(`.article-container`,
                {
                x:'200%'
                },
            {
              x:0,
              duration:0.5,
              ease: "power2.out",
              stagger:{
                each:0.15,
                from:'start'
              }
            
            })
            }
          

          
      

}

//filter
category.addEventListener('change',()=>{
    pages = 1
    let found = categoriesArr.find(item => item.name === category.value)
    found ? renderPage(`&categories=${found.id || ''}`,'') : renderPage('','')
    postSection.textContent = ''
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
    postSection.textContent = ''
    renderPage('',urlConvert)
}



async function renderPage
(
  categoryValue = '', 
  searchQuery = '', 
  animate
)
  {
    try{

        loader.classList.add('show')
        const [data, totalPosts ]= await getData(categoryValue,searchQuery) 
        renderHTML(data,totalPosts,animate)

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
