import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import playerCtrl from "../controllers/player.controller.js";
import teamCtrl from "../controllers/team.controller.js";

const router = express.Router();


// ------------------------- CRUD for POSITION ----------------------------------

router
  .route("/api/new/position")
  .post(
    authCtrl.requireSignin,
    authCtrl.isAdmin,
    playerCtrl.createPosition
  );

router.route("/api/positions")
  .get(playerCtrl.listPositions)

router
  .route("/api/position/:positionId")
  .get(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.positionRead)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.positionUpdate)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.positionRemove);





// --------------------------------- PLAYER ROUTES ----------------------------------------

// Create Player

router
  .route("/api/new/player/to/:teamId")
  .post(
    authCtrl.requireSignin, 
    playerCtrl.isPresident,
    playerCtrl.create
  );

// Listing Players

router
  .route("/api/players/photo/:playerId")
  .get(playerCtrl.photo);


router.route("/api/players").get(authCtrl.requireSignin, playerCtrl.list);

router.route('/api/players/by/:teamId')
  .get(
    playerCtrl.listByTeam
  )

router.route("/api/playerstars")
  .get(playerCtrl.listByStar)

// Search

router.route("/api/search/players")
  .get(playerCtrl.listForSearch)



//  Read , Update and Delete Player APIs

router
.route("/api/players/:playerId")
  .get(playerCtrl.incrementViews , playerCtrl.read)
  .put(authCtrl.requireSignin,playerCtrl.isPresident, playerCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.remove);




// Star Players APIs

router.route("/api/starplayers").put(authCtrl.requireSignin, playerCtrl.star);

router.route("/api/unstarplayers").put(authCtrl.requireSignin, playerCtrl.unstar);



  
  // ------------ PARAMS -------------------

router.param("positionId", playerCtrl.positionByID);
router.param("playerId", playerCtrl.playerByID);
router.param("teamId", teamCtrl.teamByID);



export default router;
