const express = require('express');
const router = express.Router();
const activitiesDataModule = require('../model/organizationActivitiesController.js');
const membersDataModule = require('../model/membersController.js');


router.get('/organization-activities', activitiesDataModule.get_view_organization_activities_page);
router.post('/add-event', activitiesDataModule.add_event);

module.exports = router;
