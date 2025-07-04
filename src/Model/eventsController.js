const Schema = require('schema.js');

async function addEvent(name, date) {
    try {

        const event = await Schema.event.create({
            name,
            date
        });

        console.log('Succesfully added a new event');
        return event;

    } catch (error) {
        console.error('Error adding event:', error.message);
        throw error; 
    }
}

async function getEvents () {
        try {
            return await Schema.event.find().exec();
        } catch (err) {
            console.error("Error fetching events:", err);
            return [];
        }
    
}

module.exports = { addEvent, getEvents };