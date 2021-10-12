const localStorage = window.localStorage
console.log(localStorage)

const state = {}
state.todos = (localStorage.todos && JSON.parse(localStorage.todos)) || []
state.input = ""
state.theme = localStorage.theme || "light"

const todoListElem = document.querySelector(".todo-list")
const inputForm = document.querySelector(".input-form")
const filterButtons = Array(...document.querySelectorAll(".nav-btn"))



//Save input as the user types
const inputField = document.querySelector("#input-field")
inputField.addEventListener("change", function(event){
    state.input = event.target.value
})

//Switch between dark and light themes
function toggleTheme(event) {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
    populateUI()
}
document.querySelector('#theme-toggler').addEventListener('click', toggleTheme)

function populateUI(todos = state.todos){

    //Check theme
    if(state.theme === 'light'){
        document.querySelector("#theme-img").setAttribute('src', '/images/icon-moon.svg')
        document.querySelector("#header").style.background = 'url("/images/bg-desktop-light.jpg")'
        document.body.style.background = 'var(--light-background-color)'
        document.querySelector(".main-section").style.background = 'var(--light-background-color)'
        document.querySelector(".todo-list").style.background = 'var(--light-theme-container-color)'
        document.querySelector(".todo-text").style.color = "#494C6B";
        document.querySelector(".input-form").style.background = 'var(--light-theme-container-color)'
        document.querySelector("#input-field").style.background = 'var(--light-theme-container-color)'
        document.querySelector("#input-field").style.color = '#393A4B'
        document.querySelector(".nav-bar").style.background = 'var(--light-background-color)'
        document.querySelector(".nav-text").style.background = 'var(--light-theme-container-color)'
        document.querySelector(".nav-menu").style.background = 'var(--light-theme-container-color)'
        document.querySelector("#clear-completed").style.background = 'var(--light-theme-container-color)'
        document.querySelector(".footer").style.background = 'var(--light-background-color)'
    }
    else{
        document.querySelector("#theme-img").setAttribute('src', '/images/icon-sun.svg')
        document.querySelector("#header").style.background = 'url("/images/bg-desktop-dark.jpg")'
        document.body.style.background = 'var(--dark-background-color)'
        document.querySelector(".main-section").style.background = 'var(--dark-background-color)'
        document.querySelector(".todo-list").style.background = 'var(--dark-theme-container-color)'
        document.querySelector(".todo-text").style.color = "#C8CBE7";
        document.querySelector(".input-form").style.background = 'var(--dark-theme-container-color)'
        document.querySelector("#input-field").style.background = 'var(--dark-theme-container-color)'
        document.querySelector("#input-field").style.color = '#ffffff'
        document.querySelector(".nav-bar").style.background = 'var(--dark-background-color)'
        document.querySelector(".nav-text").style.background = 'var(--dark-theme-container-color)'
        document.querySelector(".nav-menu").style.background = 'var(--dark-theme-container-color)'
        document.querySelector("#clear-completed").style.background = 'var(--dark-theme-container-color)'
        document.querySelector(".footer").style.background = 'var(--dark-background-color)'
    }

    //Clear and repopulate the list 
    if(document.querySelectorAll(".todo-item").length > 0){
        document.querySelectorAll(".todo-item") && document.querySelectorAll(".todo-item").forEach(elem=>{
            todoListElem.removeChild(elem)
        })
    }

    todos.length > 0 && todos.forEach(todo => {
        todoListElem.prepend(createTodoNode(todo))
    });

    document.querySelector("#item-count").textContent = `${todos.length} items left`
}

function filterTodos(filter){
    filter = filter.toLowerCase()
    return state.todos.filter(todo=>{
        if(filter === "all"){
            return true
        }else{
            return todo.status.toLowerCase() === filter
        }
    })
}

function updateStorage(){
    localStorage.todos = JSON.stringify(state.todos)
    localStorage.theme = state.theme
}

function addTodo(event){
    inputField.innerHTML = ""
    event.preventDefault()
    event.target[0].value = ""

    if(state.input){
        const id = `${Date.now()}${Math.floor(Math.random()*100)}`
        state.todos.push({
            id,
            text: state.input,
            created: Date.now,
            status: 'active'
        })
        populateUI(state.todos)       
    }
}

function deleteTodo(event){
    const todoId = event.target.parentNode.id
    state.todos = state.todos.filter(todo=> todo.id !== todoId)
    populateUI(state.todos)
}

function markCompleted(event){
    const todoId = event.target.parentNode.id
    state.todos.forEach(todo=>{
        if(todo.id === todoId){
            todo.status = (todo.status === 'active') ? 'completed' : 'active'
            console.log(todo)
        }
    })
    populateUI(state.todos)   
}

function createTodoNode(todo){
    
    //Create a list item to hold the todo
    const liNode = document.createElement('li')
    liNode.className = 'todo-item list-item'
    liNode.id = todo.id

    //Create the check button to mark a todo complete
    const btnNodeCheck = document.createElement('button')
    btnNodeCheck.className = 'icon icon-check'

    const checkImgNode = document.createElement('img')
    checkImgNode.src = '/images/icon-check.svg'
    checkImgNode.alt = 'a checkmark icon'
    const checkDivNode = document.createElement('div')

    btnNodeCheck.appendChild(checkDivNode)
    checkDivNode.appendChild(checkImgNode)

    if(todo.status === 'completed'){
        btnNodeCheck.classList.add('gradiented')
        checkDivNode.className = 'disable-bg-hover'
        checkImgNode.style.display = 'initial'
    }
    else{
        checkImgNode.style.display = 'none'
    }
    btnNodeCheck.addEventListener('click', markCompleted)

    //Create a delete button to remove a todo item
    const btnNodeclose = document.createElement('button')
    btnNodeclose.className = 'icon icon-close'
    btnNodeclose.addEventListener('click', deleteTodo)

    const xImgNode = document.createElement('img')
    xImgNode.src = '/images/icon-cross.svg'
    xImgNode.alt = 'a cross icon'
    btnNodeclose.appendChild(xImgNode)

    //Create a paragraph to hold the todo text
    const pNode = document.createElement('p',)
    pNode.className = 'todo-text'
    
    //Check if todo is marked completed and change styling accordingly
    todo.status === 'completed' && (pNode.style.color = '#D1D2DA',pNode.style.textDecorationLine = 'line-through')
    pNode.textContent = todo.text
    
    
    //Add all the elements under the li node
    liNode.appendChild(btnNodeCheck)
    liNode.appendChild(pNode)
    liNode.appendChild(btnNodeclose)
    return liNode
}

//Filter what the user sees depending on the filter selected
function filterUI(event){
    const filter = event.target.classList[1].toString()
    document.querySelectorAll(".nav-btn").forEach(btn=>{
        btn.classList.contains('activated') && btn.classList.remove('activated')
        btn.classList.contains(filter) && btn.classList.add('activated')
    })
    populateUI(filterTodos(filter))
}

//Delete Completed Todos
function clearCompleted(){
    state.todos = state.todos.filter(todo=>todo.status !== 'completed')
    populateUI(state.todos)
}

filterButtons[3].addEventListener('click', clearCompleted)

const filterButtonsClone = filterButtons.slice() //Make a copy of the array of buttons
filterButtonsClone.pop() //Remove the 'clear completed' button from the filterButtons list

//Add an event listener to each filter button
filterButtonsClone.forEach(btn=>{
    btn.addEventListener('click', filterUI)
})


inputForm.addEventListener('submit', addTodo)
window.addEventListener('unload',updateStorage) // Save current state to localStorage

populateUI(state.todos)
