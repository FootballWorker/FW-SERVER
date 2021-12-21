import express from 'express'

import authCtrl from './../controllers/auth.controller.js'
import matchCtrl from './../controllers/match.controller.js'
import teamCtrl from './../controllers/team.controller.js'

const router = express.Router()


router.route("/api/newmatch/to/:teamId")
  .post(
    authCtrl.requireSignin,
    matchCtrl.create
  )
  
router.route("/api/matches/by/:teamId")
  .get(matchCtrl.listByTeam)

router.route("/api/latest/matches/by/:teamId")
  .get(matchCtrl.latestMatches)

router.route("/api/country/matches")
  .get(authCtrl.requireSignin, matchCtrl.listForHome)

router.route("/api/matches/top/by/:teamId")
  .get(matchCtrl.topTeam)

router.route('/api/matches')
  .get(matchCtrl.list)

router.route("/api/topmatches/by/audience")
  .get(matchCtrl.listByAudience)

router.route("/api/search/for/matches")
  .get(matchCtrl.listForSearch)

router.route("/api/search/matches/by/team")
  .get(matchCtrl.searchMatchByTeam)

router.route("/api/matches/:matchId")
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

router.route("/api/audience/match")
  .put(
    authCtrl.requireSignin,
    matchCtrl.audience
  )

router
  .route("/api/disaudience/match")
  .put(authCtrl.requireSignin, matchCtrl.disaudience);

  
  
// Stats API

router.route("/api/prediction/home")
  .put(authCtrl.requireSignin,matchCtrl.predictHome)

router.route("/api/prediction/draw")
  .put(authCtrl.requireSignin,matchCtrl.predictDraw)

router.route("/api/prediction/away")
  .put(authCtrl.requireSignin,matchCtrl.predictAway)



// Params

router.param("matchId",matchCtrl.matchByID)
router.param("teamId", teamCtrl.teamByID);


export default router