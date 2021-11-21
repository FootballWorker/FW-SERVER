import nodemailer from 'nodemailer'
import {google} from 'googleapis'
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
import config from './../config/config.js'

// const {
//   process.env.MAILING_SERVICE_CLIENT_ID,
//   process.env.MAILING_SERVICE_CLIENT_SECRET,
//   process.env.MAILING_SERVICE_REFRESH_TOKEN,
//   process.env.SENDER_EMAIL_ADDRESS,
// } = config;

const oauth2Client = new OAuth2(
  process.env.MAILING_SERVICE_CLIENT_ID,
  process.env.MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
);

// send mail
export default function sendMail (to, url, txt,subtext,subject) {
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
    to: to,
    subject: `${subject}`,
    html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #51545b; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: #51545B;">Message from Football Worker</h2>
              <p>
                ${subtext}
              </p>
              
              <a href=${url} style="background: #FED829 ; border-radius: 7px ; text-decoration: none; color: #51545B ; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              <div>${url}</div>
            </div>
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err;
    return infor;
  });
};




