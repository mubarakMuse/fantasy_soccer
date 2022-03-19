const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const authorize = require("../middleware/authorize");
const {
  loginSchema,
  registerSchema,
} = require("../middleware/validateRequest");


router.post("/login", loginSchema, login);
router.post("/signup", registerSchema, signup);
router.get("/", authorize(), getAll);
router.get("/:id", authorize(), getById);
router.get("/:id/players", authorize(), getPlayersByUserId);

function login(req, res, next) {
  userService
    .login(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function signup(req, res, next) {
  userService
    .signup(req.body)
    .then(() => res.json({ message: "succesfully signed up" }))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getPlayersByUserId(req, res, next) {
  const { id } = req.params;
  userService
    .getPlayersByUserId(id)
    .then((players) => res.json(players))
    .catch(next);
}

function getById(req, res, next) {
  const { id } = req.params;
  userService
    .getById(id)
    .then((user) => res.json(user))
    .catch(next);
}

module.exports = router;
