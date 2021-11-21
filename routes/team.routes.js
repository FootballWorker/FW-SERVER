import express from "express";


import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import teamCtrl from "../controllers/team.controller.js";



const router = express.Router();

// Create Team

router
  .route("/api/new/team")
  .post(authCtrl.requireSignin, authCtrl.isAdmin, teamCtrl.create);


// Listing Teams 

router
  .route('/api/teams')
  .get(teamCtrl.list)

router.route("/api/teams/countries")
  .get(teamCtrl.listCountries)

router.route("/api/searching/for/teams")
  .get(teamCtrl.listForSearch)

router.route('/api/teams/by/stars')
  .get(teamCtrl.listByStar)


// Read , Update and Delete Team APIs

router
  .route("/api/teams/:teamId")
  .get(teamCtrl.incrementViews , teamCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin , teamCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, teamCtrl.remove);



// Application

router
  .route("/api/apply/for/team")
  .put(authCtrl.requireSignin , teamCtrl.apply);

router
  .route("/api/cancel/apply/team")
  .put(authCtrl.requireSignin, teamCtrl.cancelApply);

// Becoming Candidates

router.route("/api/run/election")
  .put(
    authCtrl.requireSignin,
    teamCtrl.isPresident,
    teamCtrl.runForElection
  )

router.route("/api/cancel/run/election")
  .put(
    authCtrl.requireSignin,
    teamCtrl.isPresident,
    teamCtrl.cancelCandidate
  )


// -------- HIRE SYSTEM ---------------

router
  .route("/api/hire/as/president")
  .put(
    authCtrl.requireSignin, 
    authCtrl.isAdmin,
    teamCtrl.makePresident,
    teamCtrl.appointedAsPresident
  );

router
  .route("/api/hire/as/vicePresident")
  .put(
    authCtrl.requireSignin,
    authCtrl.isPresident,
    teamCtrl.makeVicePresident,
    teamCtrl.appointedAsVicePresident
  );

router
  .route("/api/hire/as/manager")
  .put(
    authCtrl.requireSignin,
    authCtrl.isPresident,
    teamCtrl.makeManager,
    teamCtrl.appointedAsManager
  );

router
  .route("/api/hire/as/coach")
  .put(
    authCtrl.requireSignin,
    authCtrl.isManager,
    teamCtrl.makeCoach,
    teamCtrl.appointedAsCoach
  );


router
  .route("/api/hire/as/youth")
  .put(
    authCtrl.requireSignin,
    authCtrl.isManager,
    teamCtrl.makeYouth,
    teamCtrl.appointedAsYouth
  );


router
  .route("/api/hire/as/scout")
  .put(
    authCtrl.requireSignin,
    authCtrl.isManager,
    teamCtrl.makeScout,
    teamCtrl.appointedAsScout
  );



// ------------------ FIRE SYSTEM ---------------

router
  .route("/api/fire/from/president")
  .put(
    authCtrl.requireSignin,
    teamCtrl.firePresident,
    teamCtrl.rejectedAsPresident
  );

router
  .route("/api/fire/from/vicePresident")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireVicePresident,
    teamCtrl.rejectedAsVicePresident
  );

router
  .route("/api/firemanager")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireManager,
    teamCtrl.rejectedAsManager
  );

router
  .route("/api/fire/from/coach")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireCoach,
    teamCtrl.rejectedAsCoach
  );

router
  .route("/api/fire/from/youth")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireYouth,
    teamCtrl.rejectedAsYouth
  );

router
  .route("/api/fire/from/scout")
  .put(
    authCtrl.requireSignin,
    teamCtrl.fireScout,
    teamCtrl.rejectedAsScout
  );



  

// Star Players APIs

router.route("/api/staring/team").put(authCtrl.requireSignin, teamCtrl.star);

router.route("/api/unstaring/team").put(authCtrl.requireSignin, teamCtrl.unstar);






// Params

router.param("teamId", teamCtrl.teamByID);
router.param("userId", userCtrl.userByID); 


export default router