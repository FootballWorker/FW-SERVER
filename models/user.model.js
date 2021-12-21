import mongoose from "mongoose";
import crypto from "crypto";

import Team from "./team.model.js";
import News from "./news.model.js";
import Player from "./player.model.js";
import Notification from "./notification.model.js";
import Post from "./post.model.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minLength: 2,
    required: "Name is required",
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  background: {
    data: Buffer,
    contentType: String,
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exist",
    match: [/.+\@.+\..+/, "Please provide a valid email address"],
    required: "Email is required",
  },
  role: {
    type: String,
    default: "user",
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: "Department",
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
  },
  favoriteTeam: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
  },
  news: {
    type: mongoose.Schema.ObjectId,
    ref: "News",
  },
  country: {
    type: String,
    enum: [
      "Andorra",
      "United Arab Emirates",
      "Afghanistan",
      "Antigua and Barbuda",
      "Anguilla",
      "Albania",
      "Armenia",
      "Angola",
      "Antarctica",
      "Argentina",
      "American Samoa",
      "Austria",
      "Australia",
      "Aruba",
      "Alland Islands",
      "Azerbaijan",
      "Bosnia and Herzegovina",
      "Barbados",
      "Bangladesh",
      "Belgium",
      "Burkina Faso",
      "Bulgaria",
      "Bahrain",
      "Burundi",
      "Benin",
      "Saint Barthelemy",
      "Bermuda",
      "Brunei Darussalam",
      "Bolivia",
      "Brazil",
      "Bahamas",
      "Bhutan",
      "Bouvet Island",
      "Botswana",
      "Belarus",
      "Belize",
      "Canada",
      "Cocos (Keeling) Islands",
      "Congo, Democratic Republic of the",
      "Central African Republic",
      "Congo, Republic of the",
      "Switzerland",
      "Cote d'Ivoire",
      "Cook Islands",
      "Chile",
      "Cameroon",
      "China",
      "Colombia",
      "Costa Rica",
      "Cuba",
      "Cape Verde",
      "Curacao",
      "Christmas Island",
      "Cyprus",
      "Czech Republic",
      "Germany",
      "Djibouti",
      "Denmark",
      "Dominica",
      "Dominican Republic",
      "Algeria",
      "Ecuador",
      "Estonia",
      "Egypt",
      "Western Sahara",
      "Eritrea",
      "Spain",
      "Ethiopia",
      "Finland",
      "Fiji",
      "Falkland Islands (Malvinas)",
      "Micronesia, Federated States of",
      "Faroe Islands",
      "France",
      "Gabon",
      "United Kingdom",
      "Grenada",
      "Georgia",
      "French Guiana",
      "Guernsey",
      "Ghana",
      "Gibraltar",
      "Greenland",
      "Gambia",
      "Guinea",
      "Guadeloupe",
      "Equatorial Guinea",
      "Greece",
      "South Georgia and the South Sandwich Islands",
      "Guatemala",
      "Guam",
      "Guinea-Bissau",
      "Guyana",
      "Hong Kong",
      "Heard Island and McDonald Islands",
      "Honduras",
      "Croatia",
      "Haiti",
      "Hungary",
      "Indonesia",
      "Ireland",
      "Israel",
      "Isle of Man",
      "India",
      "British Indian Ocean Territory",
      "Iraq",
      "Iran, Islamic Republic of",
      "Iceland",
      "Italy",
      "Jersey",
      "Jamaica",
      "Jordan",
      "Japan",
      "Kenya",
      "Kyrgyzstan",
      "Cambodia",
      "Kiribati",
      "Comoros",
      "Saint Kitts and Nevis",
      "Korea, Democratic People's Republic of",
      "Korea, Republic of",
      "Kuwait",
      "Cayman Islands",
      "Kazakhstan",
      "Lao People's Democratic Republic",
      "Lebanon",
      "Saint Lucia",
      "Liechtenstein",
      "Sri Lanka",
      "Liberia",
      "Lesotho",
      "Lithuania",
      "Luxembourg",
      "Latvia",
      "Libya",
      "Morocco",
      "Monaco",
      "Moldova, Republic of",
      "Montenegro",
      "Saint Martin (French part)",
      "Madagascar",
      "Marshall Islands",
      "Macedonia, the Former Yugoslav Republic of",
      "Mali",
      "Myanmar",
      "Mongolia",
      "Macao",
      "Northern Mariana Islands",
      "Martinique",
      "Mauritania",
      "Montserrat",
      "Malta",
      "Mauritius",
      "Maldives",
      "Malawi",
      "Mexico",
      "Malaysia",
      "Mozambique",
      "Namibia",
      "New Caledonia",
      "Niger",
      "Norfolk Island",
      "Nigeria",
      "Nicaragua",
      "Netherlands",
      "Norway",
      "Nepal",
      "Nauru",
      "Niue",
      "New Zealand",
      "Oman",
      "Panama",
      "Peru",
      "French Polynesia",
      "Papua New Guinea",
      "Philippines",
      "Pakistan",
      "Poland",
      "Saint Pierre and Miquelon",
      "Pitcairn",
      "Puerto Rico",
      "Palestine, State of",
      "Portugal",
      "Palau",
      "Paraguay",
      "Qatar",
      "Reunion",
      "Romania",
      "Serbia",
      "Russian Federation",
      "Rwanda",
      "Saudi Arabia",
      "Solomon Islands",
      "Seychelles",
      "Sudan",
      "Sweden",
      "Singapore",
      "Saint Helena",
      "Slovenia",
      "Svalbard and Jan Mayen",
      "Slovakia",
      "Sierra Leone",
      "San Marino",
      "Senegal",
      "Somalia",
      "Suriname",
      "South Sudan",
      "Sao Tome and Principe",
      "El Salvador",
      "Sint Maarten (Dutch part)",
      "Syrian Arab Republic",
      "Swaziland",
      "Turks and Caicos Islands",
      "Chad",
      "French Southern Territories",
      "Togo",
      "Thailand",
      "Tajikistan",
      "Tokelau",
      "Timor-Leste",
      "Turkmenistan",
      "Tunisia",
      "Tonga",
      "Turkey",
      "Trinidad and Tobago",
      "Tuvalu",
      "Taiwan, Province of China",
      "United Republic of Tanzania",
      "Ukraine",
      "Uganda",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Holy See (Vatican City State)",
      "Saint Vincent and the Grenadines",
      "Venezuela",
      "British Virgin Islands",
      "US Virgin Islands",
      "Vietnam",
      "Vanuatu",
      "Wallis and Futuna",
      "Samoa",
      "Kosovo",
      "Yemen",
      "Mayotte",
      "South Africa",
      "Zambia",
      "Zimbabwe",
    ],
  },
  views: {
    type: Number,
    default: 0,
  },
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followerLength: {
    type: Number,
    default: 0,
  },
  facebook: String,
  twitter: String,
  instagram: String,
  blog: String,
  notifications: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Notification",
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

UserSchema.pre("remove", async function (next) {
  try {
    await Team.findOneAndUpdate(
      { _id: this.favoriteTeam },
      { $pull: { members: this._id } },
      { new: true }
    );
    await Team.findOneAndUpdate(
      { _id: this.favoriteTeam },
      { $pull: { candidates: this._id } },
      { new: true }
    );
    await Team.updateMany(
      { application: { $in: this._id } },
      { $pull: { application: this._id } },
      { multi: true }
    );
    await Team.updateMany(
      { stars: { $in: this._id } },
      { $pull: { stars: this._id }, $inc: { starLength: -1 } },
      { multi: true }
    );
    await News.updateMany(
      { applications: { $in: this._id } },
      { $pull: { applications: this._id } },
      { multi: true }
    );
    await News.updateMany(
      { subscribers: { $in: this._id } },
      { $pull: { subscribers: this._id }, $inc: { subscriberLength: -1 } },
      { multi: true }
    );
    await Player.updateMany(
      { stars: { $in: this._id } },
      { $pull: { stars: this._id }, $inc: { starLength: -1 } },
      { multi: true }
    );
    await Post.deleteMany({ postedBy: this._id });
    await Notification.deleteMany({ forWho: this._id });


    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

export default mongoose.model("User", UserSchema);
