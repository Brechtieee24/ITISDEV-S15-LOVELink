const Schema = require('./schema');


// Gets all the activities
async function get_all_activities(){
    try {
        const activities = await Schema.event.find({})
            .sort({_id:-1})
            .lean();

        return activities;

    } catch (err) {
        console.log("Database Error: ", err)
        return null
    }
}

module.exports = {
   get_all_activities
};