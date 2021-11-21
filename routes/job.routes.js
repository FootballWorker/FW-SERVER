import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import departmentCtrl from "../controllers/department.controller.js";
import jobCtrl from './../controllers/job.controller.js'



const router = express.Router();



router.route("/api/jobs/by/:departmentId")
  .post(
    authCtrl.requireSignin, 
    authCtrl.isAdmin, 
    jobCtrl.create
  )
  .get(
    jobCtrl.listByDepartment
  )

router.route("/api/jobs")
  .get(jobCtrl.list)

router.route("/api/vacant/jobs/:jobId")
  .get(
    authCtrl.requireSignin,
    jobCtrl.listVacantJobs
  )

router.route("/api/best/workers/by/:jobId")
  .get(
    authCtrl.requireSignin,
    jobCtrl.bestWorkers
  )

router
  .route("/api/jobs/:jobId")
  .get(authCtrl.requireSignin, jobCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, jobCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, jobCtrl.remove);


router.param('departmentId',departmentCtrl.departmentByID)
router.param('jobId',jobCtrl.jobByID)



export default router;