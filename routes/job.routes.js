import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import departmentCtrl from "../controllers/department.controller.js";
import jobCtrl from './../controllers/job.controller.js'



const router = express.Router();



router.route("/jobs/by/:departmentId")
  .post(
    authCtrl.requireSignin, 
    authCtrl.isAdmin, 
    jobCtrl.create
  )
  .get(
    jobCtrl.listByDepartment
  )

router.route("/jobs")
  .get(jobCtrl.list)

router.route("/vacant/jobs/:jobId")
  .get(
    authCtrl.requireSignin,
    jobCtrl.listVacantJobs
  )

router.route("/best/workers/by/:jobId")
  .get(
    authCtrl.requireSignin,
    jobCtrl.bestWorkers
  )

router
  .route("/jobs/:jobId")
  .get(authCtrl.requireSignin, jobCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, jobCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, jobCtrl.remove);


router.param('departmentId',departmentCtrl.departmentByID)
router.param('jobId',jobCtrl.jobByID)



export default router;