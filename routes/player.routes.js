import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import playerCtrl from "../controllers/player.controller.js";
import teamCtrl from "../controllers/team.controller.js";


const router = express.Router();


// ------------------------- CRUD for POSITION ----------------------------------

router
  .route("/new/position")
  .post(
    authCtrl.requireSignin,
    authCtrl.isAdmin,
    playerCtrl.createPosition
  );

router.route("/positions")
  .get(playerCtrl.listPositions)

router
  .route("/position/:positionId")
  .get(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.positionRead)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.positionUpdate)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.positionRemove);





// --------------------------------- PLAYER ROUTES ----------------------------------------

// Create Player

router
  .route("/new/player/to/:teamId")
  .post(
    authCtrl.requireSignin, 
    authCtrl.isPresident,
    playerCtrl.create
  );

// Listing Players

router
  .route("/players/photo/:playerId")
  .get(playerCtrl.photo);


router.route("/players").get(authCtrl.requireSignin, playerCtrl.list);

router.route('/players/by/:teamId')
  .get(
    playerCtrl.listByTeam
  )

router.route("/playerstars")
  .get(playerCtrl.listByStar)

// Search

router.route("/search/players")
  .get(playerCtrl.listForSearch)



//  Read , Update and Delete Player APIs

router
.route("/players/:playerId")
  .get(playerCtrl.incrementViews , playerCtrl.read)
  .put(authCtrl.requireSignin,playerCtrl.isPresident, playerCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, playerCtrl.remove);




// Star Players APIs

router.route("/starplayers").put(authCtrl.requireSignin, playerCtrl.star);

router.route("/unstarplayers").put(authCtrl.requireSignin, playerCtrl.unstar);



  
  // ------------ PARAMS -------------------

router.param("positionId", playerCtrl.positionByID);
router.param("playerId", playerCtrl.playerByID);
router.param("teamId", teamCtrl.teamByID);



export default router;
