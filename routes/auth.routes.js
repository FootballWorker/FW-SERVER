import express from 'express'
import authCtrl from '../controllers/auth.controller.js'


const router = express.Router()

// Signin
router.route('/auth/signin').post(authCtrl.signin)


// Contact
router.route('/contact/mail')
  .post(authCtrl.contact)

router.route("/presidentmail")
  .post(
    authCtrl.presidentMail
  )




// ------- FORGOT PASSWORD SYSTEM ----------

router.route('/forgotpassword')
  .post(authCtrl.forgotPassword)

router.route('/resetpassword/:resetToken')
  .post(authCtrl.resetPassword)



// Signout

router.route('/auth/signout').get(authCtrl.signout)




export default router