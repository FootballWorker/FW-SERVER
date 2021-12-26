import express from 'express'

import authCtrl from './../controllers/auth.controller.js'
import matchCtrl from './../controllers/match.controller.js'
import teamCtrl from './../controllers/team.controller.js'

const router = express.Router()


router.route("/newmatch/to/:teamId")
  .post(
    authCtrl.requireSignin,
    matchCtrl.create
  )
  
router.route("/matches/by/:teamId")
  .get(matchCtrl.listByTeam)

router.route("/latest/matches/by/:teamId")
  .get(matchCtrl.latestMatches)

router.route("/country/matches")
  .get(authCtrl.requireSignin, matchCtrl.listForHome)

router.route("/matches/top/by/:teamId")
  .get(matchCtrl.topTeam)

router.route('/matches')
  .get(matchCtrl.list)

router.route("/topmatches/by/audience")
  .get(matchCtrl.listByAudience)

router.route("/search/for/matches")
  .get(matchCtrl.listForSearch)

router.route("/search/matches/by/team")
  .get(matchCtrl.searchMatchByTeam)

router.route("/matches/:matchId")
  .get(
    matchCtrl.incrementViews,
    matchCtrl.read
  )
  .put(
    authCtrl.requireSignin,
    matchCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.isAdmin,
    matchCtrl.remove
  )



// Audience APIs

router.route("/audience/match")
  .put(
    authCtrl.requireSignin,
    matchCtrl.audience
  )

router
  .route("/disaudience/match")
  .put(authCtrl.requireSignin, matchCtrl.disaudience);

  
  
// Stats API

router.route("/prediction/home")
  .put(authCtrl.requireSignin,matchCtrl.predictHome)

router.route("/prediction/draw")
  .put(authCtrl.requireSignin,matchCtrl.predictDraw)

router.route("/prediction/away")
  .put(authCtrl.requireSignin,matchCtrl.predictAway)



// Params

router.param("matchId",matchCtrl.matchByID)
router.param("teamId", teamCtrl.teamByID);


export default router