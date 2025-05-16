const mongoose = require("mongoose");
const userModel = require("@app/users/models/user.model");

const handleCheckUser = async (mobile) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    let user = await userModel.findOne({ mobile }).session(session);

    // if user not found then create a new user
    if (!user) {
      console.log(`new user: ${mobile}`);
      user = new userModel({ mobile });
      await user.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      user,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      console.log("Duplicate mobile detected!");
    }

    console.error("Transaction failed:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = handleCheckUser;
