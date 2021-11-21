import mongoose from 'mongoose'

import User from './user.model.js'

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "The team is already exist!"],
    },
    country: {
      type: String,
      enum: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos Islands",
        "Colombia",
        "Comoros",
        "Congo",
        "Congo",
        "Cook Islands",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "South Korea",
        "North Korea",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "UAE",
        "UK",
        "United States Minor Outlying Islands",
        "USA",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands",
      ],
    },
    president: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    vicePresident: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    vicePresidentLength: {
      type: Number,
      default: 0,
    },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    coach: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    coachLength: {
      type: Number,
      default: 0,
    },
    scout: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    scoutLength: {
      type: Number,
      default: 0,
    },
    youth: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    youthLength: {
      type: Number,
      default: 0,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    application: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    candidates: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    polls: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Poll",
      },
    ],
    stars: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    starLength: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    stadium: String,
    stadiumCapacity: {
      type: Number,
      default: 15,
    },
    firstColor: String,
    secondColor: String
  },
  {
    timestamps: true,
  }
);



TeamSchema.path("vicePresidentLength").validate(function (value) {
  if (value > 6) {
    throw new Error("You can not hire more than 5 vicePresident! ");
  }
});

TeamSchema.path("coachLength").validate(function (value) {
  if (value > 6) {
    throw new Error("You can not hire more than 5 coach! ");
  }
});

TeamSchema.path("scoutLength").validate(function (value) {
  if (value > 6) {
    throw new Error("You can not hire more than 5 scout! ");
  }
});

TeamSchema.path("youthLength").validate(function (value) {
  if (value > 6) {
    throw new Error("You can not hire more than 5 youth! ");
  }
});

TeamSchema.pre("remove", async function (next) {
  try {
    await User.updateMany(
      { team: this._id },
      { $unset: { team: 1 } },
      { multi: true }
    );
    await User.updateMany(
      { team: this._id },
      { $unset: { favoriteTeam: 1 } },
      { multi: true }
    );
    return next();
  } catch (err) {
    return next(err);
  }
});


export default mongoose.model('Team',TeamSchema)