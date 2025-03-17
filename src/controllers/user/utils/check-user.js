const userModel = require('../../../models/user.model')

const handleCheckUser = async (mobile) => {
    if (!mobile) {
      console.log("mobile no. is not recieved");
      return;
    }
  
    let user = await userModel.findOne({ mobile });
  
    // if user not found then create a new user
    if (!user) {
      console.log(`new user: ${mobile}`);
      user = new userModel({ mobile });
      await user.save();
    }
  
    return user;
  };

  module.exports = handleCheckUser;