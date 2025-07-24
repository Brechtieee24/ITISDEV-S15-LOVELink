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
      .sort({ timeIn: -1 }) // Sort by latest timeIn first
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


module.exports = {
    createNewResidency,
    getMemberResidency,
    getLatestMemberResidency
};