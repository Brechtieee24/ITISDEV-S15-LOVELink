const Schema = require('./schema');

// Get and check if user email exist in the database to allow login
async function getUser(userEmail){
    try {
        const user = await Schema.member.findOne({ email: userEmail }).exec();
        console.log(user);
        if (!user) {
            console.log('No User with email found!');
            return false;
        }

        user.lastLogin = Date.now(); // update user's last login
        await user.save();
        return user;

    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }

}

async function getUserById(memberId){
    try {
        const user = await Schema.member.findOne({ _id: memberId }).exec();
        console.log(user);
        if (!user) {
            console.log('No User with object id found!');
            return false;
        }

        return user;

    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }

}

async function updateAboutInfo(email, aboutInfo) {
    try {
        const user = await Schema.member.findOne({ email }).exec();
        if (!user) return null;

        user.aboutInfo = aboutInfo;
        await user.save();
        return user;
    } catch (err) {
        console.error("Error updating about info:", err);
        throw err;
    }
}

// use in displaying about page
async function userAboutInfo(memberId) { 
     try {
        const user = await Schema.member.findOne({ _id: memberId }).exec();
        if (!user) {
            console.log('No User found!');
            return false;
        }

        return user;

    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}

async function filterByCommittee(committeeName) {
    try {
        const members = await Schema.member.find({ committee: committeeName }).lean();
        return members;
    } catch (error) {
        console.error('Error fetching members by committee:', error);
        throw error;
    }
}

async function updateFormattedResidency(committee) {
  try {
    const members = await Schema.member.find({ committee }).lean();

    for (const member of members) {
      const totalSeconds = Math.floor(member.totalResidencyTime || 0); // ensure integer

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = n => n.toString().padStart(2, '0');
      const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

      await Schema.member.findByIdAndUpdate(member._id, {
        formattedResidencyTime: formatted
      });
    }

    console.log("Formatted residency times updated from totalResidencyTime.");
  } catch (error) {
    console.error("Error updating formatted residency time:", error);
  }
}

// return filtered members based on the set min hours
async function filterByCommitteeAndHour(committeeName, hours) {
  const seconds = hours * 60 * 60;

  try {
    const members = await Schema.member.find({
      committee: committeeName,
      totalResidencyTime: { $gte: seconds }
    }).lean();

    return members;
  } catch (error) {
    console.error('Error fetching members by committee and hour:', error);
    return null;
  }
}


module.exports = {
    getUser,
    updateAboutInfo,
    userAboutInfo,
    getUserById,
    filterByCommittee,
    updateFormattedResidency,
    filterByCommitteeAndHour
};