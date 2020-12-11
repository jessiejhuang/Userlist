const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'

const users = JSON.parse(localStorage.getItem('interestPreson'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
                        <button type="button" class="btn btn-danger btn-user-remove" 
                        data-id="${item.id}">X</button>
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

function removeToInterest(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)
  localStorage.setItem('interestPreson', JSON.stringify(users))
  renderUserList(users)
}


dataPanel.addEventListener('click', function panelClick(event) {
  if (event.target.matches('.btn-user-detail')) {
    showUserDetail(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-user-remove')) {
    removeToInterest(Number(event.target.dataset.id))
  }
})

renderUserList(users)