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

// async function calculateTotalHours(events){

//     totalMS = 0;

//     for (i = 0; i < len(events); i++){
//         const timeIn = new Date(events[i].timeIn);
//         const timeOut = new Date(events[i].timeOut);
//         difference = timeIn - timeOut;
//         totalMS += difference; 
//     }

//     const totalSeconds = Math.floor(ms / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     const pad = (num) => String(num).padStart(2, '0');

//     return ${pad(hours)}:${pad(minutes)}:${pad(seconds)};
//     return total_time / 1000; //Gets the total seconds
// }

module.exports = {
   addEventParticipation,
   getEventsOfUser,
   getTotalHours,
};