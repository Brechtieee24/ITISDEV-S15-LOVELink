const express = require('express');
const router = express.Router();
const activitiesDataModule = require('../model/organizationActivitiesController.js');


router.get('/organization-activities', async (req, res) => {
   try {
        const events = await activitiesDataModule.get_all_activities();
        console.log(events);

        res.render('pages/view-organization-activities', {
            title: 'Organization Activities',
            styles: '<link rel="stylesheet" href="/css/Activities.css">',
            events: events
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
