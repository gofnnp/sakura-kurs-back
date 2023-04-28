'use strict'

const response = require('../response')
const db = require('./../settings/db')

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req 
 * @param {*} res 
 */
exports.getProducts = (req, res) => {
    db.query('SELECT * FROM `products`', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })
}

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req 
 * @param {*} res 
 */
exports.getProductGroups = (req, res) => {
    db.query('SELECT * FROM `product_groups`', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })
}