import express from "express";

import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import teamCtrl from "../controllers/team.controller.js";
import chatCtrl from "./../controllers/chat.controller.js";

const router = express.Router();

// ------------------ MESSAGE --------------------

router.route("/chats").post(authCtrl.requireSignin, chatCtrl.create);
router.route("/chat/:chatId").get(authCtrl.requireSignin,chatCtrl.addReaded, chatCtrl.read);
router.route("/chats/:userId").get(authCtrl.requireSignin, chatCtrl.list);
router.route("/unread/chats").get(authCtrl.requireSignin,chatCtrl.unRead)

router.route("/chats/team").post(authCtrl.requireSignin,chatCtrl.isPresident,chatCtrl.createTeamChat)
router.route("/chats/group").get(authCtrl.requireSignin,chatCtrl.listGroups)
router.route("/chats/rename").put(authCtrl.requireSignin,chatCtrl.isGroupAdmin, chatCtrl.renameGroup);
router.route("/chats/groupremove").put(authCtrl.requireSignin,chatCtrl.isGroupAdmin, chatCtrl.removeFromGroup);
router.route("/chats/new/user").put(authCtrl.requireSignin,chatCtrl.isGroupAdmin,chatCtrl.isIncluded, chatCtrl.addToGroup);
router.route("/workers/:teamId").get(chatCtrl.listTeamWorkers);


router.param("userId", userCtrl.userByID);
router.param("chatId", chatCtrl.chatByID);
router.param("teamId", teamCtrl.teamByID);

export default router;
