const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/homeless', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
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
})

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);

app.post('/api/listing', async (req, res) => {
  try {
    let user = await User.findOne({
      username: req.body.username,
    })
    if (!user){
        user = new User({
          username: req.body.username,
          firstName: req.body.firstName,
        })
        user.save();
    }
    const listing = new Listing({
      apartmentName: req.body.apartmentName,
      price: req.body.price,
      address: req.body.address,
      description: req.body.description,
      associatedUser: user
    });
    await listing.save();
    res.send(listing);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get('/api/user/:username/listings', async (req, res) => {
  try {
    let user = await User.findOne({username: req.params.username});
    if (!user) {
      res.send(404);
      return;
    }
    let listings = await Listing.find({associatedUser:user});
    res.send(listings);
  } catch (error) {
    res.sendStatus(500);
  }
});

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

app.get('/api/listings', async (req, res) => {
  try {
    let listings = await Listing.find();
    res.send(listings);
  } catch (error) {
    res.sendStatus(500);
  }
});

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
})

//put listing into the user using returned id number from create



app.listen(3000, () => console.log('Server listening on port 3000!'));
