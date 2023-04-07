const express = require('express')
const router = express.Router()
const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASS,
  database: 'todo_app',
})

router.get('/', async (req, res, next) => {
  connection.query(`select * from tasks;`, (error, results) => {
    console.log(error)
    console.log(results)
    res.render('index', {
      title: 'ToDo App',
      todos: results,
    })
  })
})

router.post('/', async (req, res, next) => {
  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack)
      return
    }
    console.log('success')
  })
  const todo = await req.body.add
  connection.query(
    `insert into tasks (user_id, content) values (1, '${todo}');`,
    (error, results) => {
      console.log(error)
      res.redirect('/')
    }
  )
})

router.post('/:id/update', async (req, res, next) => {
  const taskId = req.params.id
  const newContent = req.body.newContent
  connection.query(
    `UPDATE tasks SET content = '${newContent}' WHERE id = '${taskId}';`,
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error updating task')
      } else {
        res.redirect('/')
      }
    }
  )
})

router.post('/:id/delete', async (req, res, next) => {
  const taskId = req.params.id
  connection.query(
    `DELETE FROM tasks WHERE id = '${taskId}';`,
    (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error deleting task')
      } else {
        res.redirect('/')
      }
    }
  )
})

module.exports = router
