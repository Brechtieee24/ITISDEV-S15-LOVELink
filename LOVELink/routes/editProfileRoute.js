const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');

const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary'); // Make sure this path is correct
const upload = multer({ storage });


// edit profile of user 
router.get('/edit-profile', async (req, res) => {
   if (!req.isAuthenticated()) return res.redirect('/');
  
  const email = req.session.user.email; // update to user session
  const userData = await membersDataModule.getUser(email);

  console.log("Looking for email:", email);
  console.log(req.session.user.photo);
  
  res.render('pages/edit-profile', {
    title: 'Edit Profile',
    activePage: 'profile',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    aboutInfo: userData?.aboutInfo,
    photo: req.session.user.photo,
    showNavBar: true,
    styles: '<link rel="stylesheet" href="/css/Profile.css">'
  });
});

// save updated bio 
router.post('/save-profile', express.json(), async (req, res) => {
   if (!req.isAuthenticated()) return res.redirect('/');

   
  try {
    const email = req.session.user?.email;
    const { aboutInfo } = req.body;

    if (!email) return res.status(401).send('User not logged in');
    if (!aboutInfo) return res.status(400).send('Bio cannot be empty');

    const user = await membersDataModule.getUser(email);
    if (!user) return res.status(404).send("User not found");

    await membersDataModule.updateAboutInfo(email, aboutInfo);
    res.status(200).send("Success");
  } catch (err) {
    console.error("Error saving bio:", err);
    res.status(500).send("Internal server error");
  }
});

// upload profile route
router.post('/upload-profile', upload.single('profileImg'), async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');

  try {
    const email = req.session.user?.email;
    if (!req.file || !email) return res.status(400).send('Missing image or user');

    const imageUrl = req.file.path;
    const publicId = req.file.filename; // public_id from Cloudinary

    // Get user from DB
    const user = await membersDataModule.getUser(email);

    // If user has an existing image, delete it from Cloudinary
    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }

    // Update the user with new image URL and public ID
    await membersDataModule.updateUserProfilePic(email, imageUrl, publicId);
    req.session.user.photo = imageUrl;

    res.redirect('/edit-profile');
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).send("Upload failed");
  }
});



module.exports = router;
