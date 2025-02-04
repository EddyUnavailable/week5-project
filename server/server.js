import express from "express"
import cors from "cors"
import pg from "pg"
import dotenv from "dotenv"

// instastiate my app 
const app = express()

// do my 'use'
// allow incomming requests from other people 
app.use(cors())
// read incomming json
app.use(express.json())

// goes and looks for a .env file and pulls those environment variables into our node process
dotenv.config()

// a pool is a way for our express app to connect to our database
// I'll give it a connnection string so that I can connect to *my* database
const db = new pg.Pool({
    connectionString: process.env.DB_CONN
})

const form = document.getElementById('form')
const displayElem = document.getElementById('holdUi')

form.addEventListener('submit', function(event) {
    // stops our browser refreshing when submitted
    event.preventDefault()
    const result = new FormData(form)
    // turning my FormData object into a normal object
    const searchTerm = Object.fromEntries(result)
    console.log(searchTerm.query)
    fetchWordDef(searchTerm.query)
})


async function fetchWordDef(word) {
    // get my response object
    // fetch comes with JS
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    // parse the response.body as JSON
    const data = await response.json()
    generateUI(data[0])
}   



function generateUI(data) {
    // reset the p tag to have no content. 
    displayElem.innerHTML = ''
    console.log(data.meanings[0].definitions[0].definition)

    displayElem.innerText = data.meanings[0].definitions[0].definition
}