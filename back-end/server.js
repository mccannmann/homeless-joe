const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const argon2 = require("argon2");

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/homeless', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
});

const listingSchema = new mongoose.Schema({
  apartmentName: String,
  price: String,
  address: String,
  description: String,
  associatedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre('save', async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

  try {
    // generate a hash. argon2 does the salting and hashing for us
    const hash = await argon2.hash(this.password);
    // override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    // note that we supply the hash stored in the database (first argument) and
    // the plaintext password. argon2 will do the hashing and salting and
    // comparison for us.
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);

const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    // Return an error if user does not exist.
    return res.status(403).send({
      message: "not logged in"
    });
  }

  // if everything succeeds, move to the next middleware
  next();
};

//
app.post('/api/listing', validUser, async (req, res) => {
  try {
    const listing = new Listing({
      apartmentName: req.body.apartmentName,
      price: req.body.price,
      address: req.body.address,
      description: req.body.description,
      associatedUser: req.user,
    });
    await listing.save();
    res.send(listing);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Gets all listigs connected to logged in user
app.get('/api/user/:username/listings', validUser, async (req, res) => {
  try {
    let listings = await Listing.find({associatedUser:req.user});
    res.send(listings);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Gets one specific listing
app.get('/api/listings/:id', async (req, res) => {
  try {
    let listing = await Listing.findOne({_id:req.params.id});
    if (!listing) {
      res.send(404);
      return;
    }
    res.send(listing);
  } catch (error) {
    res.sendStatus(500);
  }
});


// Gets all listings in database
app.get('/api/listings', async (req, res) => {
  try {
    let listings = await Listing.find();
    res.send(listings);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Delets listing from database
app.delete('/api/user/:username/listings/:id', async (req, res) => {
  try {
    await Listing.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Updates a liting in the database
app.put('/api/user/listings/:id', async (req, res) => {
  try {
    let listing = await Listing.findOne({_id:req.params.id});
    if (!listing) {
      res.send(404);
      return;
    }
    listing.apartmentName = req.body.apartmentName;
    listing.price = req.body.price;
    listing.address = req.body.address;
    listing.description = req.body.description;
    listing.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Register a users
app.post('/api/user/register', async (req, res) => {

  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "first name, last name, username and password are required"
    });
  try {
    console.log("reached try block");
    const existingUser = await User.findOne({
      username: req.body.username
    });
    console.log(existingUser);
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
      });
      console.log("reached save");
      await user.save();

      console.log("adding user to session");
      req.session.userID = user._id;

      console.log("returning user");
      return res.send({
        user: user
      });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Login a user
app.post('/api/user/login', async (req, res) => {
  // Make sure that the form coming from the browser includes a username and a
  // password, otherwise return an error.
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    //  lookup user record
    const user = await User.findOne({
      username: req.body.username
    });
    // Return an error if user does not exist.
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // Return the SAME error if the password is wrong. This ensure we don't
    // leak any information about which users exist.
    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // set user session info
    req.session.userID = user._id;

    return res.send({
      user: user
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get logged in user
app.get('/api/login', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// logout
app.delete("/api/logout", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.listen(3005, () => console.log('Server listening on port 3005!'));
