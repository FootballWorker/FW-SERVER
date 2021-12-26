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
  .route("/posts/by/:teamId")
  .post(authCtrl.requireSignin, postCtrl.createForTeam)
  .get(authCtrl.requireSignin , postCtrl.listByTeam);

router
  .route('/playerposts/by/:playerId')
  .post(authCtrl.requireSignin,postCtrl.createForPlayer)
  .get(postCtrl.listByPlayer)

router
  .route("/matchposts/by/:matchId")
  .post(authCtrl.requireSignin, postCtrl.createForMatch)
  .get(postCtrl.listByMatch);
  
router
  .route("/newsposts/by/:newsId")
  .post(authCtrl.requireSignin,postCtrl.createForNews)
  .get(postCtrl.listByNews)



// Photo URL

router.route("/posts/imageOne/:postId").get(postCtrl.imageOne);




// Read and Delete Post

router
  .route("/posts/:postId")
  .get(postCtrl.incrementViews,postCtrl.read)
  .delete(authCtrl.requireSignin, postCtrl.isPoster, postCtrl.remove);





// ------------ LISTING POSTS -------------



router.route('/whole/posts/for/:userId')
  .get(authCtrl.requireSignin ,postCtrl.listByUser)

router.route('/departmentposts/by/:departmentId')
  .get(postCtrl.listByDepartment)

router.route('/jobposts/by/:jobId')
  .get(authCtrl.requireSignin,postCtrl.listByJob)

router.route('/followingposts/feed/:userId')
  .get(
    postCtrl.listByFollowings
  )
  
router.route('/posts/pinned/:newsId')
  .get(
    authCtrl.requireSignin,
    postCtrl.pinnedPosts
  )


// --------------  LIST FOR BESTIES AND ASIDE -----------------------

router.route('/posts/related/to/:postId')
  .get(postCtrl.listRelated)
    
router.route("/best/posts/for/:matchId")
  .get(postCtrl.listBestMatches)


router.route('/latest/team/feed')
  .get(
    authCtrl.requireSignin,
    postCtrl.latestTeam
  )

router.route('/posts')
  .get(postCtrl.list)

// --------------- LISTING FOR TEAM PAGE -------------------

router
  .route("/president/posts/by/:teamId")
  .get(postCtrl.listForPresident);

router.route("/vicePresident/posts/by/:teamId")
  .get(postCtrl.listForVicePresident)

router.route("/manager/posts/by/:teamId")
  .get(postCtrl.listForManager)

router.route("/coach/posts/by/:teamId")
  .get(postCtrl.listForCoach)

router.route("/scout/posts/by/:teamId")
  .get(postCtrl.listForScout)

router.route("/youth/posts/by/:teamId")
  .get(postCtrl.listForYouth)




// ------------ LIKE SYSTEM -------------

router.route("/liking/post").put(authCtrl.requireSignin, postCtrl.like);

router.route("/unliking/post").put(authCtrl.requireSignin, postCtrl.unlike);


// ------------- PIN SYSTEM -------------

router.route("/pin/post")
  .put(
    authCtrl.requireSignin,
    postCtrl.pin
  )

router.route("/unpin/post")
  .put(
    authCtrl.requireSignin,
    postCtrl.unpin
  )


// -------------- COMPLAIN MAIL ------------

router.route("/complain/post")
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