'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const response = require('./../response')
const db = require('./../settings/db')
const config = require('./../config')

exports.getStatuses = (req, res) => {

    db.query('SELECT * FROM statuses', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })

}

exports.changeStatusOrder = (req, res) => {
    const { statusId, orderId } = req.body

    db.query(`UPDATE orders SET status_id = ${statusId} WHERE orders.id = ${orderId}`, (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
            return
        }
        response.status(200, rows, res)
    })

}