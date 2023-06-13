"use strict";

const response = require("../response");
const db = require("./../settings/db");

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req
 * @param {*} res
 */
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM `products`", (error, rows, fields) => {
    if (error) {
      response.status(400, error, res);
    } else {
      response.status(200, rows, res);
    }
  });
};

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req
 * @param {*} res
 */
exports.getProductGroups = (req, res) => {
  db.query("SELECT * FROM `product_groups`", (error, rows, fields) => {
    if (error) {
      response.status(400, error, res);
    } else {
      response.status(200, rows, res);
    }
  });
};

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req
 * @param {*} res
 */
exports.addProduct = (req, res) => {
  console.log("###: ", req.body);
  const { name, price, group_id, description, image } = req.body;
  db.query(
    `INSERT INTO products (name, price, group_id, description, image) VALUES ('${name}', ${price}, ${group_id}, '${description}', '${image}')`,
    (error, results) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(
          200,
          { message: `Товар успешно добавлен!`, results },
          res
        );
      }
    }
  );
};

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req
 * @param {*} res
 */
exports.addProductGroups = (req, res) => {
  console.log("###: ", req.body);
  const { name } = req.body;
  db.query(
    `INSERT INTO product_groups (name) VALUES ('${name}')`,
    (error, results) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(
          200,
          { message: `Категория успешно добавлена!`, results },
          res
        );
      }
    }
  );
};

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req
 * @param {*} res
 */
exports.deleteProduct = (req, res) => {
  const { id } = req.body;
  db.query(`DELETE FROM products WHERE id=${id}`, (error, results) => {
    if (error) {
      response.status(400, error, res);
    } else {
      response.status(200, { message: `Товар успешно удален!`, results }, res);
    }
  });
};

/**
 * TODO: Test controller returns posts, need crete db table and sql request
 * @param {*} req
 * @param {*} res
 */
exports.deleteCategory = (req, res) => {
  const { id } = req.body;
  db.query(`DELETE FROM products WHERE group_id=${id}`, (error, results) => {
    if (error) {
      response.status(400, error, res);
    } else {
      db.query(
        `DELETE FROM product_groups WHERE id=${id}`,
        (error, results) => {
          if (error) {
            response.status(400, error, res);
          } else {
            response.status(
              200,
              { message: `Категория и товары из нее успешно удалены!`, results },
              res
            );
          }
        }
      );
    }
  });
};
