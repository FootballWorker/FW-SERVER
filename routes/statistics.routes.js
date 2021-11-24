import express from 'express'

import statCtrl from './../controllers/statistics.controller.js'
import userCtrl from './../controllers/user.controller.js'
import newsCtrl from './../controllers/news.controller.js'



const router = express.Router()


// ------ User ------

router.route("/api/total/likes/:userId")
  .get(statCtrl.totalLikeUser)

router.route("/api/total/comment/likes/:userId")
  .get(statCtrl.totalCommentLikes)

router.route("/api/total/likes/:newsId")
  .get(statCtrl.totalLikeNews)

router.route("/api/total/followers/:newsId")
  .get(statCtrl.totalFollowerSubscribe)





  router.param('userId',userCtrl.userByID)
  router.param('newsId',newsCtrl.newsByID)


  export default router