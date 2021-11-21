import express from 'express'

import authCtrl from "../controllers/auth.controller.js";
import departmentCtrl from "../controllers/department.controller.js";

const router = express.Router()



router
  .route("/api/departments")
  .post(authCtrl.requireSignin, authCtrl.isAdmin, departmentCtrl.create)
  .get( departmentCtrl.list);

router
  .route("/api/departments/:departmentId")
  .get(departmentCtrl.incrementViews,departmentCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, departmentCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, departmentCtrl.remove)


router.param('departmentId',departmentCtrl.departmentByID)



export default router;