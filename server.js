const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
let {students} = require('./views/students')
const fs = require('fs')
const os = require('os')
const {dateToday} = require('./views/date')
const bodyParser = require('body-parser')
const ejs = require('ejs')



app.use(express.static('public'))
//app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use((req,res,next) => {
    const user = os.hostname
    const page = req.url
    const content = `\n${user} acesss page ${page} on ${dateToday()}`
    fs.appendFile('log.txt',content,err => {
        if(err) {
            throw(err)
        }
    })
    next()
})

app.get('/', (req,res) => {
  res.render('pages/index')
})
  app.get('/students', (req,res) => {
    res.render('pages/students', {students})
  })
  
  app.get('/add-student',(req,res) => {
    res.render('pages/addStudent')
  })

  app.get('/students/:id',(req,res) => {
    const id = req.params.id
    const student= students.find(student => student.id== id)
    res.render('pages/student',{student})
  }) 


app.get('/about', (req,res) => {
    res.render('pages/about')
  })
  app.get('/contact', (req,res) => {
    res.render('pages/contact')
  })
  
  app.get('/api/students', (req,res) => {
      if(students.length > 0) {
        res.send(students)
      }
      else {
          res.send('No students exist in the list')
      }
  })
  app.get('/students/api/:id',(req,res) => {
      const id = req.params.id
      const student = students.find(student => student.id == id || student.firstName.toLowerCase() == id.toLowerCase())
      if(Object.entries(student).length>0) {
        res.send(student)
      }
      else {
       res.send('Student does not exist') 
     } 
  })
  app.post('/v1/students',(req,res) => {
      console.log(req.body)
      const allIds = students.map(student => student.id)
      let maxId = Math.max(...allIds)
      const id = maxId+1
      req.body.id = id
      req.body.skills = req.body.skills.split(', ')
      students.push(req.body)
      res.redirect('/students')
      //res.sendFile(__dirname + '/views/studentAdded.html')
  }) 
  app.post('/students/edited/:id',(req,res) => {
    console.log(req.body)
    const id = req.params.id
    const student = students.find(student => student.id ==id)
    if(Object.entries(student).length > 0) {
      student.firstName = req.body.firstName
      student.lastName = req.body.lastName
      student.country = req.body.country
      student.skills = req.body.skills.split(', ')
    }
    res.redirect(`/students/${student.id}`)
  })
  app.get('/student/:id/edit',(req,res) => {
      let id = req.params.id
      const student = students.find(student => student.id == id)
      if(Object.entries(student).length>0) {
        
        res.render('pages/editStudent',{student})
      }
      else {
          res.send('Student doesnot exist to edit')
      }
  })
  app.get('/student/:id/delete',(req,res) => {
      const id = req.params.id
      students = students.filter(student => student.id!=id)
      if(students.length)
      {
        res.redirect('/students')
      }
      else {
        res.send('Student does not exist to delete')
      }
        
      
  })
app.listen(PORT, () => {
    console.log(`The server is running in port ${PORT}`)
})





