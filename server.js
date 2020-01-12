const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const multer = require('multer');
const cors = require('cors');

const users = require("./routes/api/users");

const app = express();

app.use(express.static('public'))

// Multer Upload
var storage = multer.diskStorage({
		destination: (req, file, cb) => {
		cb(null, 'public/images/uploads')
	},
		filename: (req, file, cb) => {
			cb(null, Date.now() + '-' + file.originalname)
	}
});
const upload = multer({ storage })

app.use(cors());

app.post('/upload', upload.single('image'), (req, res) => {
	if (req.file)
		res.json({
			imageUrl: `images/uploads/${req.file.filename}`
	});
	else
		res.status("409").json("No Files to Upload.");
});

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_wgbbwk93:80c2npv1lu9cgq6f99crf8jqip@ds129459.mlab.com:29459/heroku_wgbbwk93' ,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex:true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const path = require("path")

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
