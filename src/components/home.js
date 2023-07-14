
import FetchHelper from "./fetchHelper.js";

const latestSection = document.querySelector('#latest')
const loader = document.querySelector('.spinner')

let maxPerPage = `&per_page=6`
let dateDescending = `&orderby=date&order=desc`

async function getData(){
    try{
        const API = new FetchHelper(`https://wave.jeandahldev.no/wp-json/wp/v2/posts`)
        const response = await API.get(`?_embed${maxPerPage}${dateDescending}`)
        const data = await response.json(); 
        return data


    }catch(error){
        console.log(error)
    }
}

async function renderHTML(data){

        try{
            data.forEach(async post => {
               
                const newDate = new Date(post.date)
                
                const getDay = newDate.getDate()
                const getMonth = newDate.getMonth() + 1
                const getYear = newDate.getFullYear()
            
                let formatedMonth
                let formatedDay
                
                getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
                getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
             

                const formatedText = post.excerpt.rendered
                const parser = new DOMParser();
                const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild;
                const formattedFinal = formatedElement.textContent;

      
                const postCard = document.createElement('div')
                postCard.className = 'blog-card'
        
                const postTitleContainer = document.createElement('div')
                postTitleContainer.className = 'header'
                
                const headerImageLink = document.createElement('a')
                headerImageLink.href= `details.html?id=${post.id}`

                const headerImage = document.createElement('img')
                headerImage.src = `${post._embedded['wp:featuredmedia'][0].media_details.sizes.medium_large
                .source_url}`
                headerImage.alt = `${post._embedded['wp:featuredmedia'][0].alt_text}`
      

             
                postTitleContainer.append(headerImageLink)
                headerImageLink.append(headerImage) 

    
                const cardBodyContainer = document.createElement('div')
                cardBodyContainer.className = 'card-body-container'

                const cardPostContainer = document.createElement('div')
                cardPostContainer.className = 'card-post-container'

                const postTitle = document.createElement('a')
                postTitle.textContent = post.title.rendered
                postTitle.className = 'title-link'
                postTitle.href=`details.html?id=${post.id}`

                const postArticle = document.createElement('p')
                postArticle.textContent = formattedFinal
                postArticle.className = 'subTitle-text'

                cardPostContainer.append(postTitle,postArticle)
                

                const subInfo = document.createElement('div')
                subInfo.className = 'sub-info'

                const userInfoContainer = document.createElement('div')
                userInfoContainer.className = 'user'

                const datePublished = document.createElement('small')
                datePublished.textContent = `Published: ${formatedDay}.${formatedMonth}.${getYear}`
                
                const userName = document.createElement('small')
                userName.textContent = `Author: ${post._embedded.author[0].name}`

                const categoryWrapper = document.createElement('div')
                const category = document.createElement('small')
                category.textContent = `Category: ${post._embedded['wp:term'][0][0].name}`

                const hr = document.createElement('hr')
                
                cardBodyContainer.append(cardPostContainer,hr,subInfo)
                categoryWrapper.append(category)
                userInfoContainer.append(userName,datePublished)
                subInfo.append(userInfoContainer,categoryWrapper)


                postCard.append(postTitleContainer,cardBodyContainer)


                latestSection.append(postCard)
                
            });   
        }catch(error){
            console.log(error)
        }
}

async function renderPage(){
    try{
        loader.classList.add('show')
        const data = await getData()
        renderHTML(data)

    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
        sliderFunction()



    }
}
renderPage()

//Slider 
function sliderFunction(){
    const topSlider = document.querySelectorAll('.arrow')
    const slider = document.querySelector('.slider')
    const allCards = document.querySelectorAll('.blog-card')
    let cardIndex = 2;
    const maxIndex = allCards.length - 3;
  
    topSlider.forEach( button => {

        button.addEventListener('click',(e)=>{    
            const card = document.querySelector('.blog-card') 
            let width = card.clientWidth * 5 
            if(button.className.includes('arrow-right')){                
                if (cardIndex < maxIndex) {
                    slider.scrollLeft += width;
                    cardIndex++;              
                  }      
            }
    
            if(button.className.includes('arrow-left')){
                slider.scrollLeft -= width
                cardIndex--;
        
            }
            buttonChecker(maxIndex,cardIndex)
  
        })

    })

    return [maxIndex, cardIndex]
}
function buttonChecker(maxIndex = 3,cardIndex = 1){
    const nextButton = document.querySelector('.arrow-right');
    if (cardIndex === maxIndex) {
      nextButton.setAttribute('disabled', true);
    } else {
      nextButton.removeAttribute('disabled');
    }

    const prevButton = document.querySelector('.arrow-left');
    if (cardIndex < maxIndex) {
        prevButton.setAttribute('disabled', true);
    } else {
        prevButton.removeAttribute('disabled');
    }
}


buttonChecker()

