import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import teamCtrl from "../controllers/team.controller.js";
import chatCtrl from "./../controllers/chat.controller.js";

const router = express.Router();

// ------------------ MESSAGE --------------------

router.route("/api/chats").post(authCtrl.requireSignin, chatCtrl.create);
router.route("/api/chat/:chatId").get(authCtrl.requireSignin,chatCtrl.addReaded, chatCtrl.read);
router.route("/api/chats/:userId").get(authCtrl.requireSignin, chatCtrl.list);
router.route("/api/unread/chats").get(authCtrl.requireSignin,chatCtrl.unRead)

router.route("/api/chats/team").post(authCtrl.requireSignin,chatCtrl.isPresident,chatCtrl.createTeamChat)
router.route("/api/chats/group").get(authCtrl.requireSignin,chatCtrl.listGroups)
router.route("/api/chats/rename").put(authCtrl.requireSignin,chatCtrl.isGroupAdmin, chatCtrl.renameGroup);
router.route("/api/chats/groupremove").put(authCtrl.requireSignin,chatCtrl.isGroupAdmin, chatCtrl.removeFromGroup);
router.route("/api/chats/new/user").put(authCtrl.requireSignin,chatCtrl.isGroupAdmin,chatCtrl.isIncluded, chatCtrl.addToGroup);
router.route("/api/workers/:teamId").get(chatCtrl.listTeamWorkers);


router.param("userId", userCtrl.userByID);
router.param("chatId", chatCtrl.chatByID);
router.param("teamId", teamCtrl.teamByID);

export default router;
