'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const response = require('./../response')
const db = require('./../settings/db')
const config = require('./../config')

exports.getAllUsers = (req, res) => {

    db.query('SELECT id, name, second_name, email, (SELECT name FROM roles WHERE id = users.role_id) as role_name FROM users', (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })

}

exports.getUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const data = jwt.verify(token, config.jwt)
    db.query(`SELECT id, name, second_name, email, (SELECT name FROM roles WHERE id = users.role_id) as role_name FROM users WHERE id = ${data.userId}`, (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else {
            response.status(200, rows, res)
        }
    })

}

exports.signup = (req, res) => {

    db.query("SELECT `id`, `email`, `name` FROM `users` WHERE `email` = '" + req.body.email + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else if(typeof rows !== 'undefined' && rows.length > 0) {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                response.status(302, {message: `Пользователь с таким email - ${rw.email} уже зарегстрирован!`}, res)
                return true
            })
        } else {
            const { email, name, password, secondName = 'Не указано' } = req.body
            // const email = req.body.email
            // const name = req.body.name
            // const secondName = req.body.second_name !== '' ? req.body.second_name : 'Не указано'

            const salt = bcrypt.genSaltSync(7)
            const passwordEncrypted = bcrypt.hashSync(password, salt)

            const sql = "INSERT INTO `users`(`name`, `second_name`, `email`, `password`) VALUES('" + name + "', '" + secondName + "', '" + email + "', '" + passwordEncrypted + "')";
            db.query(sql, (error, results) => {
                if(error) {
                    response.status(400, error, res)
                } else {
                    const token = jwt.sign({
                        userId: results.insertId,
                        email: email
                    }, config.jwt, { expiresIn: 120 * 120 })
                    response.status(200, {message: `Регистрация прошла успешно.`, results, token}, res)
                }
            })

        }
    })

}

exports.signin = (req, res) => {
    console.log(req.body);

    db.query("SELECT `id`, `email`, `password` FROM `users` WHERE `email` = '" + req.body.email + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res)
        } else if(rows.length <= 0) {
            response.status(401, {message: `Пользователь с email - ${req.body.email} не найден. Пройдите регистрацию.`}, res)
        } else {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                const password = bcrypt.compareSync(req.body.password, rw.password)
                if(password) {
                    //Если true мы пускаем юзера и генерируем токен
                    const token = jwt.sign({
                        userId: rw.id,
                        email: rw.email
                    }, config.jwt, { expiresIn: 120 * 120 })

                    response.status(200, {token: `Bearer ${token}`}, res)

                } else {
                    //Выкидываем ошибку что пароль не верный
                    response.status(401, {message: `Пароль не верный.`}, res)

                }
                return true
            })
        }
    })

}