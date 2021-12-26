import express from "express";

import authCtrl from "./../controllers/auth.controller.js";
import attributeCtrl from "./../controllers/attribute.controller.js";
import playerCtrl from "./../controllers/player.controller.js";

const router = express.Router();

// ------------------------ Attribute Routes ----------------------------

router
  .route("/record/attribute/:playerId")
  .post(authCtrl.requireSignin, attributeCtrl.isTechnic, attributeCtrl.create);

router
  .route("/attributes/category/averages/:playerId")
  .get(attributeCtrl.averageAttributes);

router
  .route("/attributes/by/:playerId")
  .get(authCtrl.requireSignin, authCtrl.isAdmin, attributeCtrl.list);

router
  .route("/assessments/user/:playerId")
  .get(authCtrl.requireSignin, attributeCtrl.listByUser);

router
  .route("/attributes/:attributeId")
  .get(authCtrl.requireSignin, attributeCtrl.read)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, attributeCtrl.remove);

router
  .route("/attributes/rescore")
  .put(authCtrl.requireSignin, attributeCtrl.isRecorded, attributeCtrl.update);

router.param("attributeId", attributeCtrl.attributeByID);
router.param("playerId", playerCtrl.playerByID);

export default router;
