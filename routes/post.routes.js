import express from 'express'

import authCtrl from "../controllers/auth.controller.js";
import departmentCtrl from "../controllers/department.controller.js";
import jobCtrl from "../controllers/job.controller.js";
import teamCtrl from "../controllers/team.controller.js";
import playerCtrl from "../controllers/player.controller.js";
import newsCtrl from "../controllers/news.controller.js";
import postCtrl from "./../controllers/post.controller.js";
import userCtrl from "./../controllers/user.controller.js";
import matchCtrl from "./../controllers/match.controller.js";


const router = express.Router()


// ------------------ CREATE POSTS ----------------

router
  .route("/api/posts/by/:teamId")
  .post(authCtrl.requireSignin, postCtrl.createForTeam)
  .get(authCtrl.requireSignin , postCtrl.listByTeam);

router
  .route('/api/playerposts/by/:playerId')
  .post(authCtrl.requireSignin,postCtrl.createForPlayer)
  .get(postCtrl.listByPlayer)

router
  .route("/api/matchposts/by/:matchId")
  .post(authCtrl.requireSignin, postCtrl.createForMatch)
  .get(postCtrl.listByMatch);
  
router
  .route("/api/newsposts/by/:newsId")
  .post(authCtrl.requireSignin,postCtrl.createForNews)
  .get(postCtrl.listByNews)



// Photo URL

router.route("/api/posts/imageOne/:postId").get(postCtrl.imageOne);




// Read and Delete Post

router
  .route("/api/posts/:postId")
  .get(postCtrl.incrementViews,postCtrl.read)
  .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove);





// ------------ LISTING POSTS -------------



router.route('/api/whole/posts/for/:userId')
  .get(authCtrl.requireSignin ,postCtrl.listByUser)

router.route('/api/departmentposts/by/:departmentId')
  .get(postCtrl.listByDepartment)

router.route('/api/jobposts/by/:jobId')
  .get(authCtrl.requireSignin,postCtrl.listByJob)

router.route('/api/followingposts/feed/:userId')
  .get(
    postCtrl.listByFollowings
  )
  
router.route('/api/posts/pinned/:newsId')
  .get(
    authCtrl.requireSignin,
    postCtrl.pinnedPosts
  )


// --------------  LIST FOR BESTIES AND ASIDE -----------------------

router.route('/api/posts/related/to/:postId')
  .get(postCtrl.listRelated)
    
router.route("/api/best/posts/for/:matchId")
  .get(postCtrl.listBestMatches)


router.route('/api/latest/team/feed')
  .get(
    authCtrl.requireSignin,
    postCtrl.latestTeam
  )

router.route('/api/posts')
  .get(postCtrl.list)

// --------------- LISTING FOR TEAM PAGE -------------------

router
  .route("/api/president/posts/by/:teamId")
  .get(postCtrl.listForPresident);

router.route("/api/vicePresident/posts/by/:teamId")
  .get(postCtrl.listForVicePresident)

router.route("/api/manager/posts/by/:teamId")
  .get(postCtrl.listForManager)

router.route("/api/coach/posts/by/:teamId")
  .get(postCtrl.listForCoach)

router.route("/api/scout/posts/by/:teamId")
  .get(postCtrl.listForScout)

router.route("/api/youth/posts/by/:teamId")
  .get(postCtrl.listForYouth)




// ------------ LIKE SYSTEM -------------

router.route("/api/liking/post").put(authCtrl.requireSignin, postCtrl.like);

router.route("/api/unliking/post").put(authCtrl.requireSignin, postCtrl.unlike);


// ------------- PIN SYSTEM -------------

router.route("/api/pin/post")
  .put(
    authCtrl.requireSignin,
    postCtrl.pin
  )

router.route("/api/unpin/post")
  .put(
    authCtrl.requireSignin,
    postCtrl.unpin
  )


// -------------- COMPLAIN MAIL ------------

router.route("/api/complain/post")
  .post(
    postCtrl.complain
  )


// --------- PARAMS ------------

router.param("userId", userCtrl.userByID);
router.param("postId", postCtrl.postByID);
router.param("playerId", playerCtrl.playerByID);
router.param("teamId", teamCtrl.teamByID);
router.param("departmentId", departmentCtrl.departmentByID);
router.param("matchId", matchCtrl.matchByID);
router.param("jobId", jobCtrl.jobByID);
router.param("newsId", newsCtrl.newsByID);



export default router