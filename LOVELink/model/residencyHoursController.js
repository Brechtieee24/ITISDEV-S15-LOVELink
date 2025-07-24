const Schema = require('./schema');
const membersDataModule = require('./membersController'); 

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

// sum of all residency hours 
async function computeTotalResidency(memberId) {
  try {
    const records = await Schema.residencyhour.find({ memberId });

    let totalMilliseconds = 0;

    for (const record of records) {
      const timeIn = new Date(record.timeIn);
      const timeOut = new Date(record.timeOut);
      totalMilliseconds += timeOut - timeIn;
    }

    return totalMilliseconds; 
  } catch (err) {
    console.error('Error computing total residency time:', err);
    throw err;
  }
}

async function updateTotalResidencyForCommittee(committee) {
  try {
    const members = await membersDataModule.filterByCommittee(committee);

    for (const member of members) {
      const records = await Schema.residencyhour.find({ memberId: member._id });

      let totalSeconds = 0;
      for (const record of records) {
        const timeIn = new Date(record.timeIn);
        const timeOut = new Date(record.timeOut);
        totalSeconds += Math.floor((timeOut - timeIn) / 1000);
      }

      // Save the totalResidencyTime back to the member
      await Schema.member.updateOne(
        { _id: member._id },
        { $set: { totalResidencyTime: totalSeconds } }
      );
    }

    console.log(`Successfully updated total residency time for all members of ${committee}`);
  } catch (err) {
    console.error('Failed to update residency times:', err);
  }
}



module.exports = {
    createNewResidency,
    getMemberResidency,
    getLatestMemberResidency,
    computeTotalResidency, 
    updateTotalResidencyForCommittee
};