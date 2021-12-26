import express from 'express'

import userCtrl from '../controllers/user.controller.js'
import teamCtrl from '../controllers/team.controller.js'
import newsCtrl from '../controllers/news.controller.js'
import authCtrl from "../controllers/auth.controller.js";
import departmentCtrl from "../controllers/department.controller.js"


const router = express.Router() 

// Route For Getting and Creating



router.route("/users").get(userCtrl.list).post(userCtrl.create);

  
router.route('/activation/:activationToken')
  .post(userCtrl.activation)


router.route("/users/photo/:userId")
  .get(userCtrl.photo);

router.route("/users/background/:userId")
  .get(userCtrl.background);

// Change Background Image
router.route("/background/:userId")
  .put(authCtrl.requireSignin,authCtrl.hasAuthorization,userCtrl.updateBackground)



router.route("/searchusers").get(userCtrl.searchUsers);

router.route("/applicants/by/:teamId")
  .get(userCtrl.applicants)

router.route("/newsapplications/by/:newsId")
  .get(userCtrl.newsApplicants)

// ------- FOLLOWING SYSTEM ---------

// Route For Following
router.route('/following/user')  
  .put(
    authCtrl.requireSignin,
    userCtrl.addFollowing,  
    userCtrl.addFollower
    )

// Route For Unfollowing
router.route('/unfollowing/user')
  .put(
    authCtrl.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
    )

router.route("/followers/by/:userId")
  .get(
    authCtrl.requireSignin,
    userCtrl.followerLength
  )

router.route("/followings/by/:userId")
  .get(
    authCtrl.requireSignin,
    userCtrl.followingsLength
  )


//  --------------- CRUD -------------------
  
router
  .route('/users/:userId')
  .get(authCtrl.requireSignin,userCtrl.incrementViews , userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization , userCtrl.remove)

router.route("/changeFavorite")
  .put(
    authCtrl.requireSignin,
    userCtrl.changeFavorite
  )

// ------------------------------- NOTIFICATIONS ---------------------------------


router.route("/newntf/:userId")
  .post(
    authCtrl.requireSignin,
    userCtrl.ntfFromSite
  )

router.route('/notifications/by/:userId')
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.notificationList,
  )


router.route("/unread/notifications")
  .get(
    authCtrl.requireSignin,
    userCtrl.unReadList
  )


router.route("/notifications/:notificationId")
  .get(
    authCtrl.requireSignin,
    userCtrl.changeStatus,
    userCtrl.readNotification
  )
  .delete(
    authCtrl.requireSignin,
    userCtrl.removeNtf
  )

router.route("/remove/notifications")
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