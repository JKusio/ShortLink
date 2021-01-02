const User = require('../model/user');
const UserCredentials = require('../model/userCredentials');

class AuthService {
    constructor() {}

    async registerUser(name, email, password) {
        const userRecord = new User({
            name: name
        });

        try {
            await userRecord.save();
        } catch (err) {
            throw err;
        }

        const userCredentials = new UserCredentials({
            userID: userRecord._id,
            password,
            email,
        });

        try {
            await userCredentials.save();
        } catch (err) {
            userRecord.remove();
            throw err;
        }

        return userRecord;
    }

    async updateUserLastLogin(id) {
        try {
            await User.updateOne({_id: id}, {lastLogin: Date.now()});
        } catch (err) {
            throw new Error('Couldn\'t update user last login time!');
        }
    }
}

module.exports = AuthService;