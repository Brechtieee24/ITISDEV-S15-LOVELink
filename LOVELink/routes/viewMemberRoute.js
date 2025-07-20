const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');

router.get('/view-other-members', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

   try {
        const email = req.session.user.email;; // update to user session
        const userData = await membersDataModule.getUser(email);

        res.render('pages/view-members', {
            title: 'View Members',
            styles: '<link rel="stylesheet" href="/css/Activities.css">',
            showNavBar: true,
            user: userData,
            photo: req.session.user.photo,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
