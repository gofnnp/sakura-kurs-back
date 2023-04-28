'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const response = require('./../response')
const db = require('./../settings/db')
const config = require('./../config')

exports.getAllOrders = (req, res) => {

    db.query('SELECT id, dateCreated, dateChanges, products, (SELECT email FROM users WHERE id = orders.user_id) as email, status_id FROM orders ORDER BY id DESC', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })

}

exports.getUserOrders = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const data = jwt.verify(token, config.jwt)
    db.query(`SELECT id, dateCreated, dateChanges, products, user_id, (SELECT name FROM statuses WHERE id = orders.status_id) as status_name FROM orders WHERE user_id = ${data.userId} ORDER BY id DESC`, (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })

}

exports.addOrder = (req, res) => {

    const { products } = req.body
    const token = req.headers.authorization.split(' ')[1]
    const data = jwt.verify(token, config.jwt)

    const sql = `INSERT INTO orders (products, user_id) VALUES ('${JSON.stringify(products)}', ${data.userId})`;
    db.query(sql, (error, results) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, {message: `Заказ успешно создан!`, results}, res)
        }
    })
}