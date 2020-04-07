const shortid = require('shortid')
const express = require('express')

const server = express()
server.use(express.json())

let users = [
  {
    id: "unique-id", // hint: use the shortid npm package to generate it
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane"  // String, required
  },
  {
    id: "hello", 
    name: "Joe", 
    bio: "Big joe" 
  }
]

//endpoints
server.get('/api/users', (req, res) => {
  if (!users.length){
    return res.status(500).json({errorMessage: "The users information could not be retrieved."})
  } else {
    res.json(users)
  }
})

server.get('/api/users/:id', (req, res) => {
  let index = users.findIndex(el => {
    return el.id === req.params.id
  })
  if (!(index >= 0)){
    res.status(404).json({message: "The user with the specified ID does not exist."})
  } else {
    res.status(200).json(users[index])  
  }
})

server.post(`/api/users`, (req, res) => {
  if (!req.body.name || !req.body.bio){
    res.status(400).json({errorMessage: "Please provide name and bio for the user."})
  } else {
    let user = {
      id: shortid.generate(),
      ...req.body
    }
    
    if (users.find(el => el.id === user.id)){
      res.status(500).json({errorMessage: "There was an error while saving the user to the database"})
    } else {
      users.push(user)
      res.status(201).json(users)
    }
  }
})

server.delete(`/api/users/:id`, (req, res) => {
  if (!users.find(el => el.id === req.params.id)){
    res.status(404).json({ message: "The user with the specified ID does not exist."})
  } else {
    users = users.filter(el => el.id !== req.params.id)
    res.status(200).json(users)
  }
})

//port
const port = 5000
server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

