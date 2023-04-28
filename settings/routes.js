"use strict";

module.exports = (app) => {
  const passport = require("passport");
  const usersController = require("./../Controller/UsersController");
  const postsController = require("../Controller/ProductsController");
  const ordersController = require("../Controller/OrdersController");
  const statusesController = require("../Controller/StatusesController");

  app.route("/api/auth/signup").post(usersController.signup);

  app.route("/api/auth/signin").post(usersController.signin);

  app
    .route("/api/users")
    .get(
      passport.authenticate("jwt", { session: false }),
      usersController.getAllUsers
    );

  app
    .route("/api/user")
    .get(
      passport.authenticate("jwt", { session: false }),
      usersController.getUser
    );

  app.route("/api/products").get(postsController.getProducts);

  app.route("/api/product-groups").get(postsController.getProductGroups);

  app
    .route("/api/all-orders")
    .get(
      passport.authenticate("jwt", { session: false }),
      ordersController.getAllOrders
    );

  app
    .route("/api/add-order")
    .post(
      passport.authenticate("jwt", { session: false }),
      ordersController.addOrder
    );

  app
    .route("/api/user-orders")
    .get(
      passport.authenticate("jwt", { session: false }),
      ordersController.getUserOrders
    );

  app
    .route("/api/statuses")
    .get(
      passport.authenticate("jwt", { session: false }),
      statusesController.getStatuses
    );

  app
    .route("/api/change-status-order")
    .post(
      passport.authenticate("jwt", { session: false }),
      statusesController.changeStatusOrder
    );
};
