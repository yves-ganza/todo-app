const initialize = ()=>{
    const localStorage = window.localStorage
    if(!localStorage){
        console.error('Storage not supported')
        return
    }

    const theme = localStorage.theme || 'light'
    const todos = localStorage.todos || []

    const updateUI = ()=>{
        
    }
}