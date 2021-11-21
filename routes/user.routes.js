import express from 'express'

import userCtrl from '../controllers/user.controller.js'
import teamCtrl from '../controllers/team.controller.js'
import newsCtrl from '../controllers/news.controller.js'
import authCtrl from "../controllers/auth.controller.js";
import departmentCtrl from "../controllers/department.controller.js"


const router = express.Router() 

// Route For Getting and Creating



router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

  
router.route('/api/activation/:activationToken')
  .post(userCtrl.activation)


router.route("/api/users/photo/:userId")
  .get(userCtrl.photo);


router.route("/api/searchusers").get(userCtrl.searchUsers);

router.route("/api/applicants/by/:teamId")
  .get(userCtrl.applicants)

router.route("/api/newsapplications/by/:newsId")
  .get(userCtrl.newsApplicants)

// ------- FOLLOWING SYSTEM ---------

// Route For Following
router.route('/api/following/user')  
  .put(
    authCtrl.requireSignin,
    userCtrl.addFollowing,  
    userCtrl.addFollower
    )

// Route For Unfollowing
router.route('/api/unfollowing/user')
  .put(
    authCtrl.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
    )

router.route("/api/followers/by/:userId")
  .get(
    authCtrl.requireSignin,
    userCtrl.followerLength
  )

router.route("/api/followings/by/:userId")
  .get(
    authCtrl.requireSignin,
    userCtrl.followingsLength
  )


//  --------------- CRUD -------------------
  
router
  .route('/api/users/:userId')
  .get(authCtrl.requireSignin,userCtrl.incrementViews , userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization , userCtrl.remove)

router.route("/api/changeFavorite")
  .put(
    authCtrl.requireSignin,
    userCtrl.changeFavorite
  )

// ------------------------------- NOTIFICATIONS ---------------------------------


router.route("/api/newntf/:userId")
  .post(
    authCtrl.requireSignin,
    userCtrl.ntfFromSite
  )

router.route('/api/notifications/by/:userId')
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.notificationList,
  )


router.route("/api/unread/notifications")
  .get(
    authCtrl.requireSignin,
    userCtrl.unReadList
  )


router.route("/api/notifications/:notificationId")
  .get(
    authCtrl.requireSignin,
    userCtrl.changeStatus,
    userCtrl.readNotification
  )
  .delete(
    authCtrl.requireSignin,
    userCtrl.removeNtf
  )

router.route("/api/remove/notifications")
  .delete(
    authCtrl.requireSignin,
    userCtrl.removeAll
  )




// --------- PARAMS --------------



router.param('userId', userCtrl.userByID) 
router.param('notificationId', userCtrl.notificationByID) 
router.param('teamId', teamCtrl.teamByID) 
router.param('newsId', newsCtrl.newsByID) 
router.param('departmentId' , departmentCtrl.departmentByID)







export default router