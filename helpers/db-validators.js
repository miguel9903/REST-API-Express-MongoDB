const Role = require('../models/role');
const User = require('../models/user');

const validateRole = async (role = '') => {

    // Check if the role is in the database
    const existRole = await Role.findOne({ role: role });
    if(!existRole) {
        throw new Error(`${ role } role is not registred`);
    }

}

const existEmail = async (email = '') => {

    // Check if the mail exists
    const existEmail = await User.findOne({ email: email });
    if(existEmail) {
        throw new Error(`The email ${ email } is already registered`);
    }
    
}

const existUserId = async (userID = '') => {
    
    // Check if the user exists
    const existUser = await User.findById(userID);
    if(!existUser) {
        throw new Error('The user does not exist');
    }

}

const validateQueryParam = (queryParam) => {
    if(queryParam) {
        if(isNaN(queryParam)) {
            throw new Error(`The parameter ${ queryParam } must be of type number`);
        }
    }
}

module.exports = {
    validateRole,
    existEmail,
    existUserId,
    validateQueryParam
};