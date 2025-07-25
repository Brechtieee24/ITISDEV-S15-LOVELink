const Schema = require('./schema');
const membersDataModule = require('./membersController'); 

// add new residency
async function createNewResidency(timeIn, memberId) { 
  try {
    const newResidency = await Schema.residencyhour.create({
      timeIn,
      timeOut: null,
      memberId
    });

    console.log('Successfully added an ongoing residency!');
    console.log('Time In: ' + timeIn);
    console.log('Member ID: ' + memberId);
    
    return newResidency;

  } catch (error) {
    console.error('Error adding residency:', error.message);
    throw error; 
  }
}


// get ongoing residency
async function getOngoingResidency(memberId) {
  try {
    const ongoingRecord = await Schema.residencyhour.findOne({
      memberId,
      timeOut: null
    }).lean();
    
    return ongoingRecord;
  } catch (error) {
    console.error('Error fetching ongoing residency record:', error);
    throw error;
  }
}

// close the ongoing residency
async function setOngoingResidency(objectId) {
  try {
    const updatedRecord = await Schema.residencyhour.findByIdAndUpdate(
      objectId,
      { timeOut: new Date() },
      { new: true } // return the updated document
    ).lean();

    console.log('Successfully updated ongoing residency:', updatedRecord);
    return updatedRecord;
  } catch (error) {
    console.error('Error updating ongoing residency record:', error);
    throw error;
  }
}

// get the list of member's residency 
async function getMemberResidency(memberId) {
  try {
    const residencyRecords = await Schema.residencyhour.find({ memberId, timeOut: { $ne: null } })
      .sort({ timeIn: -1 }) // Sort by latest timeIn first
      .lean();
    return residencyRecords;
  } catch (error) {
    console.error('Error fetching residency records for user:', error);
    throw error;
  }
}

// get latest member residency
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
    const records = await Schema.residencyhour.find({ memberId, timeOut: { $ne: null } });

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

// update total residency of members for the selected committee
async function updateTotalResidencyForCommittee(committee) {
  try {
    const members = await membersDataModule.filterByCommittee(committee);

    for (const member of members) {
      const records = await Schema.residencyhour.find({ memberId: member._id, timeOut: { $ne: null } });

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

// get monthly residency 
async function computeMonthlyResidency(memberId, year = 2025, months = ['may', 'june', 'july']) {
  const logs = await getMemberResidency(memberId);

  const monthlyResidency = {};

  for (const log of logs) {
    const { timeIn, timeOut } = log;

    const logMonth = timeIn.toLocaleString('default', { month: 'long' }).toLowerCase(); 
    const logYear = timeIn.getFullYear();

    if (logYear === year && months.includes(logMonth)) {
      if (!monthlyResidency[logMonth]) monthlyResidency[logMonth] = 0;
      monthlyResidency[logMonth] += (timeOut - timeIn);
    }
  }

  // Format for display
  const formattedResidency = {};
  for (const month of months) {
    const totalMs = monthlyResidency[month] || 0;
    const totalSec = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    formattedResidency[month] = `${hours} hours and ${minutes} minutes`;
  }

  return formattedResidency;
}

module.exports = {
    createNewResidency,
    getOngoingResidency,
    setOngoingResidency,
    getMemberResidency,
    getLatestMemberResidency,
    computeTotalResidency, 
    updateTotalResidencyForCommittee,
    computeMonthlyResidency
};