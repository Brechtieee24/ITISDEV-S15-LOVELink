const Schema = require('./schema');
const Event = Schema.event;

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
    get_all_activities,
    add_event
};