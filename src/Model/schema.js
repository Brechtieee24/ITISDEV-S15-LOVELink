const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const membersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {    // update erd
        type: String,
        required: true,
        unique: true
    },
    committee: {
        type: String,
        required: true
    },
    isOfficer : {
        type: Boolean,
        default: false,
    },
    aboutInfo: { // update erd
        type: String,
        default: 'Hi!'
    },

    lastLogin: Date // update erd
});

const residencyHoursSchema = new Schema({
    timeIn:{
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: true
    },
    memberId: { 
        type: Schema.Types.ObjectId,
        ref: 'member', // reference on "members" collection
        required: true
    }
});

const activityParticipationsSchema = new Schema({
    memberId: { 
        type: Schema.Types.ObjectId,
        ref: 'member', // reference on "members" collection
        required: true
    },
    eventId: { 
        type: Schema.Types.ObjectId,
        ref: 'event', // reference on "events" collection
        required: true
    }

});

const eventsSchema = new Schema({
    eventName:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
});

module.exports = {
    member: mongoose.model('member', membersSchema),
    residencyhour: mongoose.model('residencyhour', residencyHoursSchema),
    activityparticipation: mongoose.model('activityparticipation', activityParticipationsSchema),
    event: mongoose.model('event', eventsSchema)
}