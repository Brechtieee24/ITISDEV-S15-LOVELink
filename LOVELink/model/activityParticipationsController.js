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

async function calculateDuration(timeIn,timeOut){

    const timeIn = new Date(timeIn);
    const timeOut = new Date(timeOut);
    difference = timeIn - timeOut;

    const totalSeconds = Math.floor(difference / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

module.exports = {
   addEventParticipation,
   getEventsOfUser,
   calculateDuration,
};