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




// =================================================================================
// Create New User
async function createUser(firstname, lastname, email, password, isTechnician) {
    try {
        const existingUser = await Schema.User.findOne({ email }).exec();
        if (existingUser) {
            throw new Error('User already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Schema.User.create({
            email,
            firstname,
            lastname,
            password: hashedPassword,
            lastLogin: new Date(), 
            isTechnician: isTechnician
        });

        console.log('Registration successful!');
        return newUser;

    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error; 
    }
}


async function getAllUsers() {
    try {
        return await Schema.User.find().exec();
    } catch (err) {
        console.error("Error fetching users:", err);
        return [];
    }
}


async function findById(userId) {
    try {
        const user = await Schema.User.findOne({ _id: userId }).exec();
        
        if (!user) {
            console.log('No User found!');
            return null;
        }

        return user;
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}


async function updateAboutInfo(email, aboutInfo) {
    try {
        const user = await Schema.User.findOne({ email }).exec();
        if (!user) return null;

        user.aboutInfo = aboutInfo;
        await user.save();
        return user;
    } catch (err) {
        console.error("Error updating about info:", err);
        throw err;
    }
}

// Delete user
async function deleteUser(id) {
    try {
        console.log(`Deleting user with ID: ${id}`);

        const user = await Schema.User.findByIdAndDelete(id).exec();

        if (!user) {
            console.log('User not found.');
            return { success: false, message: 'User not found' };
        }

        console.log('User deleted successfully.');
        return { success: true, message: 'User deleted successfully' };

    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: error.message };
    }
}

module.exports = {
    createUser,
    getAllUsers,
    isExistingUser,
    getUser,
    updateAboutInfo,
    findById,
    deleteUser
};