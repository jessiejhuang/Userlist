const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const USER_PER_PAGE = 12

const users = []
let filterUsers = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


function renderUserList(data) {
    let rawHTML = ''
    data.forEach((item) => {
        console.log(item)
        rawHTML += `
            <div class="card mb-2" style="width: 16rem;">
                <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${item.name} ${item.surname}</h5>
                        <button type="button" class="btn btn-info btn-user-detail" data-toggle="modal"
                            data-target="#PersonModal" data-id="${item.id}">About Me</button>
                        <button type="button" class="btn btn-danger btn-user-interest" 
                        data-id="${item.id}">Interest</button>
                </div>
            </div>
    `
    })
    dataPanel.innerHTML = rawHTML
}

function showUserDetail(id) {
    const Mail = document.querySelector('.user-mail')
    const Gender = document.querySelector('.user-gender')
    const Age = document.querySelector('.user-age')
    const Region = document.querySelector('.user-region')
    const Birth = document.querySelector('.user-birthday')
    const Title = document.querySelector('#user-title')
    axios.get(INDEX_URL + '/' + id).then((response) => {
        const data = response.data
        Mail.innerText = 'Email: ' + data.email
        Gender.innerText = 'Gender: ' + data.gender
        Age.innerText = 'Age: ' + data.age
        Region.innerText = 'Region: ' + data.region
        Birth.innerText = 'Birthday: ' + data.birthday
        Title.innerText = data.name + ' ' + data.surname
    })
}

function addToInterest(id) {
    console.log(id)
    const list = JSON.parse(localStorage.getItem('interestPreson')) || []
    const user = users.find((user) => user.id === id)

    if (list.some((user) => user.id === id)) {
        return alert('已加入喜愛清單了！')
    }

    list.push(user)
    localStorage.setItem('interestPreson', JSON.stringify(list))

}

function renderPaginator(amount) {
    const numberOfPage = Math.ceil(amount / USER_PER_PAGE)
    let rawHTML = ''
    for (let page = 1; page <= numberOfPage; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
    }

    paginator.innerHTML = rawHTML
}

function getUserByPage(page) {
    const data = filterUsers.length ? filterUsers : users
    const startIndex = (page - 1) * USER_PER_PAGE
    return data.slice(startIndex, startIndex + USER_PER_PAGE)
}


searchForm.addEventListener('submit', function searchFormSubmitted(event) {
    event.preventDefault()
    const searchWord = searchInput.value.trim().toLowerCase()
    filterUsers = users.filter((user) => user.name.toLowerCase().includes(searchWord))
    renderPaginator(filterUsers.length)
    renderUserList(getUserByPage(1))

    if (filterUsers.length === 0) {
        return alert(`無法搜尋：${searchWord}，請重新輸入`)
    }
})

paginator.addEventListener('click', function paginatorClick(event) {
    if (event.target.tagName !== 'A') return
    const page = Number(event.target.dataset.page)
    renderUserList(getUserByPage(page))
})

dataPanel.addEventListener('click', function panelClick(event) {
    if (event.target.matches('.btn-user-detail')) {
        showUserDetail(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-user-interest')) {
        addToInterest(Number(event.target.dataset.id))
    }
})

axios.get(INDEX_URL)
    .then((response) => {
        users.push(...response.data.results)
        renderPaginator(users.length)
        renderUserList(getUserByPage(1))
    })
    .catch((err) => console.log(err))