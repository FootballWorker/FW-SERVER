import express from 'express'

import authCtrl from './../controllers/auth.controller.js'
import attributeCtrl from './../controllers/attribute.controller.js'
import playerCtrl from './../controllers/player.controller.js'



const router = express.Router()




// ------------------------ Attribute Routes ----------------------------

router.route("/api/record/attribute/:playerId")
  .post(authCtrl.requireSignin,attributeCtrl.isTechnic,attributeCtrl.create)

router.route("/api/attributes/category/averages/:playerId")
  .get(attributeCtrl.averageAttributes)

router.route("/api/attributes/by/:playerId")
  .get(attributeCtrl.list)

router
  .route("/api/attributes/:attributeId")
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, attributeCtrl.remove);



router.param("attributeId",attributeCtrl.attributeByID)
router.param("playerId",playerCtrl.playerByID)

export default router