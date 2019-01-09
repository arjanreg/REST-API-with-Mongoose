const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/edx-course-db')

let app = express()
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorHandler())

const Account = mongoose.model('Account', {
    name: String,
    balance: Number 
})

app.get('/accounts', (req, res) => {
    Account.find((error, accounts) => {
        if(error) return res.status(500).send(`Failed to fetch due to ${error}`)
        res.status(200).send(accounts)
    })
})

app.post('/accounts', (req, res) => {
    let account = new Account({
        name: req.body.name,
        balance: req.body.balance
    })
    account.save((error) => {
        if(error) return res.status(500).send(`Failed to save due to ${error}`)
    })
    res.status(201).send({id: account._id})
})

app.put('/accounts/:id', (req, res) => {
    var condition = {_id: req.params.id};
    var options = {multi: false};
    Account.update(condition, req.body, options, (error, account) => {
        if(error) return res.status(500).send(`Failed to update due to ${error}`)
        res.status(200).send(account)
    })
})

app.delete('/accounts/:id', (req, res) => {
    var condition = {_id: req.params.id};
    Account.remove(condition, (error, account) => {
        if(error) return res.status(500).send(`Failed to delete due to ${error}`)
        const response = {
            message: "Account successfully deleted",
            id: account._id
        };
        res.status(204).send(response)
    })
})

app.listen(3000)

