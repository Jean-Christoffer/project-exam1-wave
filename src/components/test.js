const postContainer = document.createElement('div')
postContainer.className = 'blog-card'


const imgContainer = document.createElement('div')
imgContainer.className = 'blog-card-img-container'
const postImage = document.createElement('img')
postImage.src = `${post._embedded['wp:featuredmedia'][0].source_url}`
postImage.className = 'blog-card-img'
imgContainer.append(postImage)

const cardBody = document.createElement('div')
cardBody.className = 'card-body'

const category = document.createElement('span')
category.className = `${post._embedded['wp:term'][0][0].name} tag`

category.textContent = `${post._embedded['wp:term'][0][0].name}`

const postTitle = document.createElement('a')
postTitle.textContent = post.title.rendered
postTitle.className = 'title-link'
postTitle.href=`details.html?id=${post.id}`


const readMore = document.createElement('a')
readMore.textContent = 'Read more'

readMore.href = `details.html?id=${post.id}`
readMore.className = 'read-more'

const postArticle = document.createElement('p')
postArticle.textContent = formattedFinal
postArticle.className = 'subTitle-text'

const postArticleContainer = document.createElement('article')
postArticleContainer.append(postTitle, postArticle,readMore)

const cardBottom = document.createElement('div')
cardBottom.className = 'card-bottom'

const writer = document.createElement('div')
writer.className = 'writer'



const userInfo = document.createElement('div')
const userName = document.createElement('p')
userName.textContent = `Author: ${post._embedded.author[0].name}`


const dateWritten = document.createElement('small')
const newDate = new Date(post.date)

const getDay = newDate.getDate()
const getMonth = newDate.getMonth() + 1
const getYear = newDate.getFullYear()

let formatedMonth
let formatedDay

getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
dateWritten.textContent = `Published: ${formatedDay}.${formatedMonth}.${getYear}`



userInfo.append(userName,dateWritten)
writer.append( userInfo)
cardBottom.append(writer)
cardBody.append(category,postArticleContainer,cardBottom)
postContainer.append(imgContainer,cardBody)

postSection.append(postContainer)