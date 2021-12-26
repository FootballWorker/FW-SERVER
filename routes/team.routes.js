import express from "express";


import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import teamCtrl from "../controllers/team.controller.js";



const router = express.Router();

// Create Team

router
  .route("/new/team")
  .post(authCtrl.requireSignin, authCtrl.isAdmin, teamCtrl.create);


// Listing Teams 

router
  .route('/teams')
  .get(teamCtrl.list)

router.route("/teams/countries")
  .get(teamCtrl.listCountries)

router.route("/searching/for/teams")
  .get(teamCtrl.listForSearch)

router.route('/teams/by/stars')
  .get(teamCtrl.listByStar)

router.route('/liked/teams/by/:userId')
  .get(authCtrl.requireSignin,teamCtrl.listByLiked)

// Read , Update and Delete Team APIs

router
  .route("/teams/:teamId")
  .get(teamCtrl.incrementViews , teamCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin , teamCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, teamCtrl.remove);



// Application

router
  .route("/apply/for/team")
  .put(authCtrl.requireSignin , teamCtrl.apply);

router
  .route("/cancel/apply/team")
  .put(authCtrl.requireSignin, teamCtrl.cancelApply);

// Becoming Candidates

router.route("/run/election")
  .put(
    authCtrl.requireSignin,
    teamCtrl.isPresident,
    teamCtrl.runForElection
  )

router.route("/cancel/run/election")
  .put(
    authCtrl.requireSignin,
    teamCtrl.isPresident,
    teamCtrl.cancelCandidate
  )


// -------- HIRE SYSTEM ---------------

router
  .route("/hire/as/president")
  .put(
    authCtrl.requireSignin, 
    authCtrl.isAdmin,
    teamCtrl.makePresident,
    teamCtrl.appointedAsPresident
  );

router
  .route("/hire/as/vicePresident")
  .put(
    authCtrl.requireSignin,
    authCtrl.isPresident,
    teamCtrl.makeVicePresident,
    teamCtrl.appointedAsVicePresident
  );

router
  .route("/hire/as/manager")
  .put(
    authCtrl.requireSignin,
    authCtrl.isPresident,
    teamCtrl.makeManager,
    teamCtrl.appointedAsManager
  );

router
  .route("/hire/as/coach")
  .put(
    authCtrl.requireSignin,
    authCtrl.isManager,
    teamCtrl.makeCoach,
    teamCtrl.appointedAsCoach
  );


router
  .route("/hire/as/youth")
  .put(
    authCtrl.requireSignin,
    authCtrl.isManager,
    teamCtrl.makeYouth,
    teamCtrl.appointedAsYouth
  );


router
  .route("/hire/as/scout")
  .put(
    authCtrl.requireSignin,
    authCtrl.isManager,
    teamCtrl.makeScout,
    teamCtrl.appointedAsScout
  );



// ------------------ FIRE SYSTEM ---------------

router
  .route("/fire/from/president")
  .put(
    authCtrl.requireSignin,
    teamCtrl.firePresident,
    teamCtrl.rejectedAsPresident
  );

router
  .route("/fire/from/vicePresident")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireVicePresident,
    teamCtrl.rejectedAsVicePresident
  );

router
  .route("/firemanager")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireManager,
    teamCtrl.rejectedAsManager
  );

router
  .route("/fire/from/coach")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireCoach,
    teamCtrl.rejectedAsCoach
  );

router
  .route("/fire/from/youth")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireYouth,
    teamCtrl.rejectedAsYouth
  );

router
  .route("/fire/from/scout")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireScout,
    teamCtrl.rejectedAsScout
  );



  

// Star Players APIs

router.route("/staring/team").put(authCtrl.requireSignin, teamCtrl.star);

router.route("/unstaring/team").put(authCtrl.requireSignin, teamCtrl.unstar);






// Params

router.param("teamId", teamCtrl.teamByID);
router.param("userId", userCtrl.userByID); 


export default router