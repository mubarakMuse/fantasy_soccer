const express = require("express");
const playerService = require("../services/playerService");
const authorize = require("../middleware/authorize");
const { updatePlayerSchema } = require("../middleware/validateRequest");
const router = express.Router();

router.use(authorize());
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", updatePlayerSchema, update);

function getAll(req, res, next) {
  playerService
    .getAll()
    .then((players) => res.json(players))
    .catch(next);
}

function getById(req, res, next) {
  const { id } = req.params;
  playerService
    .getById(id)
    .then((player) => res.json(player))
    .catch(next);
}

function update(req, res, next) {
  const { id } = req.params;
  playerService
    .update(id, req.user.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

module.exports = router;
