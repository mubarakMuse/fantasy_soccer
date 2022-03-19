const express = require("express");
const router = express.Router();
const transferService = require("../services/transferService");
const authorize = require("../middleware/authorize");
const { sellPlayerSchema } = require("../middleware/validateRequest");

router.use(authorize());

router.post("/:id/sell", sellPlayerSchema, sell);
router.post("/:id/buy", buy);
router.get("/active", getActiveTransfers);
router.get("/", getAll);

function sell(req, res, next) {
  transferService
    .sell(req.params.id, req.user.id, req.body)
    .then((transfer) => res.json(transfer))
    .catch(next);
}
function buy(req, res, next) {
  transferService
    .buy(req.params.id, req.user.id)
    .then(() => res.json({message: "successful purchase"}))
    .catch(next);
}

function getActiveTransfers(req, res, next) {
  transferService
    .getActiveTransfers()
    .then((transfers) => res.json(transfers))
    .catch(next);
}

function getAll(req, res, next) {
  transferService
    .getAll()
    .then((transfers) => res.json(transfers))
    .catch(next);
}

module.exports = router;
