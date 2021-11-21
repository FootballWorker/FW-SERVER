import express from 'express'
import authCtrl from '../controllers/auth.controller.js'


const router = express.Router()

// Signin
router.route('/api/auth/signin').post(authCtrl.signin)


// Contact
router.route('/api/contact/mail')
  .post(authCtrl.contact)

router.route("/api/presidentmail")
  .post(
    authCtrl.presidentMail
  )




// ------- FORGOT PASSWORD SYSTEM ----------

router.route('/api/forgotpassword')
  .post(authCtrl.forgotPassword)

router.route('/api/resetpassword/:resetToken')
  .post(authCtrl.resetPassword)



// Signout

router.route('/api/auth/signout').get(authCtrl.signout)




export default router