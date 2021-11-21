import nodemailer from 'nodemailer'
import {google} from 'googleapis'
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
import config from './../config/config.js'

// const {
//   process.env.MAILING_SERVICE_CLIENT_ID,
//   mailSecretKey,
//   mailRefreshToken,
//   senderMail,
// } = config;

const oauth2Client = new OAuth2(
  process.env.MAILING_SERVICE_CLIENT_ID,
  process.env.MAILING_SERVICE_CLIENT_SECRET,
  process.env.MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

export default function receiveMail (text){
  oauth2Client.setCredentials({
    refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL_ADDRESS,
      clientId: process.env.MAILING_SERVICE_CLIENT_ID,
      clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: process.env.SENDER_EMAIL_ADDRESS,
    subject: "Contact Us",
    text: text,
    html: `
      <h3 style={{alignItems: 'center'}} >Recommandation From Guests</h3>
      <br />
      <div>
        ${text}
      </div>

    `
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err;
    return infor;
  });
}