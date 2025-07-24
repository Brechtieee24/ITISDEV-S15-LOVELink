const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');
const residencyDataModule = require('../model/residencyHoursController.js');

// view profile of other member
router.get('/view-other-members', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

   try {
        const email = req.session.user.email;; // update to user session
        const userData = await membersDataModule.getUser(email);

        res.render('pages/view-members', {
            title: 'View Members',
            styles: '<link rel="stylesheet" href="/css/Members.css">',
            showNavBar: true,
            user: userData,
            photo: req.session.user.photo,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// view committee-specific members
router.get('/specific-office-members', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

   try {
        const email = req.session.user.email;; // update to user session
        const userData = await membersDataModule.getUser(email);
        const committeeName = req.query.position; 
        await residencyDataModule.updateTotalResidencyForCommittee(committeeName);
        await membersDataModule.updateFormattedResidency(committeeName);

        const members = await membersDataModule.filterByCommittee(committeeName);

        res.render('pages/specific-office-members', {
            title: 'View Members',
            styles: '<link rel="stylesheet" href="/css/SpecificMembers.css">',
            showNavBar: true,
            user: userData,
            photo: req.session.user.photo,
            position: committeeName,
            members: members
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// view filtered members
router.get('/filtered-office-members', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

   try {
        const email = req.session.user.email;; // update to user session
        const userData = await membersDataModule.getUser(email);
        const committeeName = req.query.position; 
        const filterHour = req.query.hour;

        console.log(filterHour, " ", committeeName);

        const members = await membersDataModule.filterByCommitteeAndHour(committeeName,filterHour);
        console.log("filtered members:", members);


        res.render('pages/specific-office-members', {
            title: 'View Members',
            styles: '<link rel="stylesheet" href="/css/SpecificMembers.css">',
            showNavBar: true,
            user: userData,
            photo: req.session.user.photo,
            position: committeeName,
            members: members
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
