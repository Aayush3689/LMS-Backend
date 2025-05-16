const userModel = require("@app/users/models/user.model");
const courseModel = require("../models/courses.model");

const handleEnrolledCourse = async (req, res) => {
  const userId = req.user._id;

  try {
    // find user by id and get enrolled courses
    const user = await userModel
      .findById(userId)
      .select("enrolledCourseIds")
      .populate("enrolledCourseIds")
      .lean();

    // check whether user has been enrolled in courses
    const totalCoursesEnrolled = user.enrolledCourseIds.length;
    if (totalCoursesEnrolled == 0) {
      return res.status(200).json({
        success: false,
        message: "No courses found",
      });
    }


    return res.status(200).json({
      success: true,
      courses: user.enrolledCourseIds,
    });
  } catch (error) {
    console.log('error in handleEnrolledCourse', error)
    return res.json({
      success: false,
      message: error,
    })
  }
};

module.exports = handleEnrolledCourse;
