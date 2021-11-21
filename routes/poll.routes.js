import express from 'express'

import authCtrl from './../controllers/auth.controller.js'
import teamCtrl from './../controllers/team.controller.js'
import pollCtrl from './../controllers/poll.controller.js'



const router = express.Router()


router.route("/api/polls/for/:teamId")
  .post(
    authCtrl.requireSignin,
    pollCtrl.create
  )
  .get(
    pollCtrl.listByTeam
  )
  
router
  .route("/api/polls/vote/for")
  .post(
    authCtrl.requireSignin,
    pollCtrl.isMember, 
    pollCtrl.vote
  );
      

router.route("/api/polls")
  .get(pollCtrl.listOpen)


router
  .route("/api/polls/:pollId")
  .get(authCtrl.requireSignin,pollCtrl.read)
  .delete(
    authCtrl.requireSignin,
    authCtrl.isAdmin,
    pollCtrl.remove
  )





router.param('pollId',pollCtrl.pollByID)
router.param('teamId',teamCtrl.teamByID)



export default router