const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/", indexController.index);

/* GET Login */
router.get("/login", authController.login_get);
/* POST Login */
router.post("/login", authController.login_post);

/* GET Test Login */
router.get("/test-login", authController.test_login_get);
/* POST Test Login */
router.post("/test-login", authController.test_login_post);

/* GET Sign Up */
router.get("/sign-up", authController.sign_up_get);
/* POST Sign Up */
router.post("/sign-up", authController.sign_up_post);

/* GET Log Out */
router.get("/logout", authController.logout_get);

/* GET Create Message */
router.get("/create-message", messageController.create_message_get);

/* POST Create Message */
router.post("/create-message", messageController.create_message_post);

/* GET Become Member */
router.get("/become-member", userController.become_member_get);

/* POST Become Member */
router.post("/become-member", userController.become_member_post);

// /*POST Delete Message by User */
router.post(
  "/message/:id/user-delete",
  messageController.user_delete_message_post
);

/* POST Delete Message by Admin */
router.post(
  "/message/:id/admin-delete",
  messageController.admin_delete_message_post
);

module.exports = router;
