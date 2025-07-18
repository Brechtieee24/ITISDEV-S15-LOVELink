const Schema = require('./schema');

async function addEventParticipation(memberId, eventId) {
    try {

        const newEventParticipation = await Schema.activityparticipation.create({
            memberId,
            eventId
        });

        console.log('Succesfully added an event participation!');
        console.log('Member:' + memberId);
        console.log('Event:' + eventId);
        return newEventParticipation;

    } catch (error) {
        console.error('Error adding event participation:', error.message);
        throw error; 
    }
}

async function getEventsOfUser(memberId) {
    try {
        const participations = await Schema.activityparticipation.find({ memberId })
            .populate('eventId')  
            .lean(); 

        const events = participations.map(p => p.eventId);
        return events;
    } catch (error) {
        console.error('Error fetching events for user:', error);
        throw error;
    }
}

module.exports = {
   addEventParticipation,
   getEventsOfUser
};