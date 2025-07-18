const express = require('express');
const router = express.Router();
const activitiesDataModule = require('../model/organizationActivitiesController.js');
const membersDataModule = require('../model/membersController.js');

// paexplain ng 1st route na yan
// router.get('/organization-activities', activitiesDataModule.get_view_organization_activities_page);
router.post('/add-event', activitiesDataModule.add_event);


router.get('/organization-activities', async (req, res) => {
   try {
        const email = req.session.user.email;; // update to user session
        const userData = await membersDataModule.getUser(email);
        const events = await activitiesDataModule.get_all_activities();
        console.log(events);

        res.render('pages/view-organization-activities', {
            title: 'Organization Activities',
            styles: '<link rel="stylesheet" href="/css/Activities.css">',
            events: events,
            showNavBar: true,
            user: userData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
