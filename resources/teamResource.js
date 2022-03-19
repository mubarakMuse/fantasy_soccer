const express = require("express");
const teamService = require("../services/teamService");
const authorize = require("../middleware/authorize");
const { updateTeamSchema } = require("../middleware/validateRequest");
const router = express.Router();

router.use(authorize());
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", updateTeamSchema, update);

function getAll(req, res, next) {
  teamService
    .getAll()
    .then((teams) => res.json(teams))
    .catch(next);
}

function getById(req, res) {
  const { id } = req.params;
  teamService
    .getById(id)
    .then((team) => res.json(team))
    .catch(next);
}

function update(req, res, next) {
  const { id } = req.params;
  teamService
    .update(id, req.user.id, req.body)
    .then((team) => res.json(team))
    .catch(next);
}

module.exports = router;
