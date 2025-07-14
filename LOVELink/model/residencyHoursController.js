const Schema = require('./schema');

async function createNewResidency(timeIn, timeOut, memberId) { // store in express route the time in before creating this object
    try {
            const newResidency = await Schema.residencyhour.create({
                timeIn,
                timeOut,
                memberId
            });
    
            console.log('Succesfully added a residency!');
            console.log('Time In:' + timeIn);
            console.log('Time Out:' + timeOut);
            console.log('Member ID' + memberId);
            return newResidency;
    
        } catch (error) {
            console.error('Error adding event participation:', error.message);
            throw error; 
        }
    
}

async function getMemberResidency(memberId) {
    try {
        const residencyRecords = await Schema.residencyhour.find({ memberId })
            .lean();
        return residencyRecords;
    } catch (error) {
        console.error('Error fetching residency records for user:', error);
        throw error;
    }
}

async function getLatestMemberResidency(memberId) {
    try {
        const latestRecord = await Schema.residencyhour.findOne({ memberId })
            .sort({ timeOut: -1 }) // Sort by most recent timeOut
            .lean();
        return latestRecord;
    } catch (error) {
        console.error('Error fetching latest residency record:', error);
        throw error;
    }
}


async function filteredMembers() {
    try {
        const records = await Schema.residencyhour.find().lean();

        const memberHours = {}; // empty array for storing members

        records.forEach(record => {
            const memberId = record.memberId.toString();
            const timeIn = new Date(record.timeIn);
            const timeOut = new Date(record.timeOut);
            const durationInHours = (timeOut - timeIn) / (1000 * 60 * 60); // ms to hours which = 4 hrs

            if (!memberHours[memberId]) {
                memberHours[memberId] = 0;
            }

            memberHours[memberId] += durationInHours;
        });

        const lowHourMemberIds = Object.entries(memberHours)
            .filter(([_, hours]) => hours < 4)
            .map(([memberId, _]) => mongoose.Types.ObjectId(memberId));

        const members = await Schema.member.find({ _id: { $in: lowHourMemberIds } }).lean();
        return members;
        
    } catch (error) {
        console.error('Error filtering members:', error);
        throw error;
    }
}

module.exports = {
    createNewResidency,
    getMemberResidency,
    getLatestMemberResidency,
    filteredMembers
};