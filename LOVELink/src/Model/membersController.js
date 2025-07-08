const Schema = require('schema.js');

// Get and check if user email exist in the database to allow login
async function getUser(email){
    try {
        const user = await Schema.member.findOne({ email }).exec();
        if (!user) {
            console.log('No User with email found!');
            return false;
        }

        user.lastLogin = Date.now(); // update user's last login
        await user.save();
        return true;

    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }

}

async function updateAboutInfo(memberId, aboutInfo) {
    try {
        const user = await Schema.member.findOne({ _id: memberId }).exec();
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

module.exports = {
    getUser,
    updateAboutInfo,
    userAboutInfo,
    filterByCommittee
};