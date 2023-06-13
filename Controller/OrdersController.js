"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const response = require("./../response");
const db = require("./../settings/db");
const config = require("./../config");

exports.getAllOrders = (req, res) => {
  db.query(
    "SELECT id, dateCreated, dateChanges, products, (SELECT email FROM users WHERE id = orders.user_id) as email, status_id, street, house, flat, phone FROM orders ORDER BY id DESC",
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.getUserOrders = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, config.jwt);
  db.query(
    `SELECT id, dateCreated, dateChanges, products, user_id, (SELECT name FROM statuses WHERE id = orders.status_id) as status_name, street, house, flat, phone FROM orders WHERE user_id = ${data.userId} ORDER BY id DESC`,
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.addOrder = (req, res) => {
  const { products, orderInfo } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, config.jwt);

  const sql = `INSERT INTO orders (products, user_id, street, house, flat, phone) VALUES ('${JSON.stringify(
    products
  )}', ${data.userId}, '${orderInfo.street}', '${orderInfo.house}', '${
    orderInfo.flat
  }', '${orderInfo.phone}')`;
  db.query(sql, (error, results) => {
    if (error) {
      response.status(400, error, res);
    } else {
      response.status(200, { message: `Заказ успешно создан!`, results }, res);
    }
  });
};
