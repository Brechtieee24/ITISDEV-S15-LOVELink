const Schema = require('./schema');
const Event = Schema.event;
const activitiesDataModule = require('../model/organizationActivitiesController.js');
const membersDataModule = require('../model/membersController.js');

// Loads the View Organization Activities Page
async function get_view_organization_activities_page(req,res){
    try {
        const email = "albrecht_abad@dlsu.edu.ph"; // update to user session
        // const email = "cedric_ong@dlsu.edu.ph"; // update to user session

        const userData = await membersDataModule.getUser(email);
        const events = await get_all_activities();
        console.log(events);

        res.render('pages/view-organization-activities', {
            title: 'Organization Activities',
            styles: '<link rel="stylesheet" href="/css/Activities.css">',
            events: events,
            user: userData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// Gets all the activities
async function get_all_activities(){
    try {
        const activities = await Schema.event.find({})
            .sort({_id:-1})
            .lean();

        return activities;

    } catch (error) {
        console.error("Database Error: ", err)
        return null
    }
}

// Add an event [FUTURE IMPROVEMENTS CHECK FOR DUPLICATES CANT BE DUPLICATE, AND UNIFORM DATES]
async function add_event(req,res){
    try {
        const newEvent = new Event({
        eventName: req.body.ename,
        date: req.body.date,
      });
  
        await newEvent.save();
        console.log('Event successfully added');
        res.redirect('organization-activities');

    } catch(error){
        console.error('Error creating event: ', error);
        res.status(500).redirect('/home');
    }
}

module.exports = {
    get_view_organization_activities_page,
    get_all_activities,
    add_event
};