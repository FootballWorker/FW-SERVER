import express from 'express'

import authCtrl from './../controllers/auth.controller.js'
import newsCtrl from './../controllers/news.controller.js'
import userCtrl from './../controllers/user.controller.js'


const router = express.Router()


router.route("/api/news")
  .get(authCtrl.requireSignin,newsCtrl.list)
  .post(authCtrl.requireSignin,authCtrl.isEditor,newsCtrl.create)
  

// Photo
router
  .route("/api/news/photo/:newsId")
  .get(newsCtrl.photo);


router.route("/api/news/:newsId")
  .get(authCtrl.requireSignin, newsCtrl.incrementViews, newsCtrl.read)
  .put(authCtrl.requireSignin, newsCtrl.isEditor , newsCtrl.update)
  .delete(authCtrl.requireSignin,authCtrl.isAdmin ,newsCtrl.remove)




// Listing

router.route("/api/news/by/:userId")
  .get(
    authCtrl.requireSignin,
    newsCtrl.listByUser
  )

router.route("/api/topnews")
  .get(
    newsCtrl.listTop
  )



// Application

router.route("/api/apply/for/news")
  .put(
    authCtrl.requireSignin,
    newsCtrl.applyFor
  )

router.route("/api/cancel/apply/news")
  .put(
    authCtrl.requireSignin,
    newsCtrl.cancelApply
  )



// -------------------------- Hiring and Firing --------------------------------

// Hiring

router.route("/api/hireEditor")
  .put(
    authCtrl.requireSignin,
    newsCtrl.hireEditor,
    newsCtrl.appointEditor
  )

router.route("/api/hireEmployee")
  .put(
    authCtrl.requireSignin,
    newsCtrl.isEditor ,
    newsCtrl.hireEmployee,
    newsCtrl.appointedToNews
  )

// Firing

router.route("/api/fireEditor")
  .put(
    authCtrl.requireSignin,
    newsCtrl.fireEditor,
    newsCtrl.rejectEditor

  )

router.route("/api/fireEmployee")
  .put(
    authCtrl.requireSignin,
    newsCtrl.fireEmployee,
    newsCtrl.rejectedFromNews
  )




// ------------------------- Subscribing ----------------------------

router.route("/api/subscribe/news")
  .put(
    authCtrl.requireSignin,
    newsCtrl.subscribe
  )

router
  .route("/api/unsubscribe/news")
  .put(authCtrl.requireSignin, newsCtrl.unsubscribe);


// Params

router.param('userId',userCtrl.userByID)
router.param('newsId',newsCtrl.newsByID)




export default router