import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import commentCtrl from "./../controllers/comment.controller.js";
import postCtrl from "../controllers/post.controller.js";
import userCtrl from "../controllers/user.controller.js";




const router = express.Router();



// --------------- CRUD -------------

router
  .route("/api/comments/:postId")
  .post(authCtrl.requireSignin, commentCtrl.create)
  .get(authCtrl.requireSignin,commentCtrl.list);


  
// Photo URL

router
  .route("/api/comments/imageOne/:commentId")
  .get(commentCtrl.imageOne);

router
  .route('/api/comments/by/:userId')
  .get(authCtrl.requireSignin,commentCtrl.listByUser)

router
  .route("/api/singlecomment/:commentId")
  .get( commentCtrl.read)
  .delete(authCtrl.requireSignin, commentCtrl.isCommenter, commentCtrl.remove);




// ------- COMMENTS FOR ASIDE MENU ----------

router.route("/api/comments/related/:commentId")
  .get(authCtrl.requireSignin,commentCtrl.listRelated)

router.route("/api/best/comments/:postId")
  .get(authCtrl.requireSignin,commentCtrl.bestCommentPosts)

router.route("/api/bestcomments/:userId")
  .get(authCtrl.requireSignin,commentCtrl.bestCommentUsers)



// -------- LIKE SYSTEM ----------

router.route("/api/comments/like")
  .put(
    authCtrl.requireSignin, 
    commentCtrl.like
  );

router.route("/api/comments/unlike")
  .put(
    authCtrl.requireSignin, 
    commentCtrl.unlike
  );




// -------- PARAMS ------------

router.param("postId", postCtrl.postByID);
router.param("commentId", commentCtrl.commentByID);
router.param("userId", userCtrl.userByID);

export default router;
