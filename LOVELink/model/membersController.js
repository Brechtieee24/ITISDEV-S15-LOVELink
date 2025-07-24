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

async function addTotalActivityTime(email,duration){
    try {
        const user = await Schema.member.findOne({email}).exec()
        if (!user) return null;

        user.totalResidencyTime += duration;
        await user.save();
        return user;
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}

async function formatTotalActivityTime(email){
    try {
        const user = await Schema.member.findOne({email}).exec()
        if (!user) return null;

        const totalSeconds = Math.floor(user.totalResidencyTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');

        const formattedDate = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

        user.formattedResidencyTime = formattedDate;

        await user.save();
        
        return user
    } catch (err){
        console.error("Error fetching user:", err);
        return null;
    }
}

async function filterByCommitteeandHour(committeeName, hours) {
    milliseconds = hours * 60 * 60 * 1000

    try {
        const members = await Schema.member.find({committee: committeeName, totalResidencyTime: { $gte: milliseconds }}).lean();
        return members;
    } catch (error) {
        console.error('Error fetching members by committee:', error);
        return null;
    }
}

module.exports = {
    getUser,
    updateAboutInfo,
    userAboutInfo,
    getUserById,
    filterByCommittee,
    addTotalActivityTime,
    formatTotalActivityTime,
    filterByCommitteeandHour
};