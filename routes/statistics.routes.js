import express from 'express'

import statCtrl from './../controllers/statistics.controller.js'
import userCtrl from './../controllers/user.controller.js'
import newsCtrl from './../controllers/news.controller.js'
import teamCtrl from './../controllers/team.controller.js'



const router = express.Router()


// ------ User ------

router.route("/total/likes/:userId")
  .get(statCtrl.totalLikeUser)

router.route("/total/comment/likes/:userId")
  .get(statCtrl.totalCommentLikes)

router.route("/total/likes/:newsId")
  .get(statCtrl.totalLikeNews)

router.route("/total/followers/:newsId")
  .get(statCtrl.totalFollowerSubscribe)


// ------ Team -------

router.route("/total/value/players/:teamId")
  .get(statCtrl.totalValue)





router.param('userId',userCtrl.userByID)
router.param('newsId',newsCtrl.newsByID)
router.param('teamId',teamCtrl.teamByID)

  export default router