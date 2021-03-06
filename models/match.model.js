import mongoose from 'mongoose'

import Team from './team.model.js'
import Post from './post.model.js'

const MatchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  home: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  away: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  audiences: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  season: {
    type: String,
    enum:[
      '2021/2022',
      '2022/2023',
      '2023/2024',
      '2024/2025',
      '2025/2026',
      '2026/2027',
      '2027/2028',
      '2028/2029',
      '2029/2030',
      '2030/2031',
      '2031/2032',
      '2032/2033',
      '2033/2034',
      '2034/2035',
      '2035/2036',
      '2036/2037',
      '2037/2038',
      '2038/2039',
      '2039/2040',
    ],
    default: '2021/2022',
    required: [true,"You have to select season!"]
  },
  section: {
    type:String,
    enum:[
      'League',
      'Cup',
      'International'
    ],
    default: 'League',
    required: [true,'You have to select section!']
  },
  date: {
    type: Date,
    required: true
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
  homeScore: String,
  awayScore: String,
  country: String,
  probability: {
    homePercent: {
      type: Number,
      default: 0,
    },
    drawPercent: {
      type: Number,
      default: 0,
    },
    awayPercent: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  views:{
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
})

MatchSchema.pre("remove", async function (next) {
  try {
    await Post.deleteMany({match : this._id})
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('Match',MatchSchema)