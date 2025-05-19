const { error, success } = require("@utils/responseHandler");
const createCourse = require("../services/createCourse");

const handleCreateCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const thumbnail = req.file;

    if (!courseData) {
      return error(res, 400, "Course data should not be empty");
    }

    if (!thumbnail) {
      return error(res, 400, "Thumbnail not found");
    }

    // thumbnail path
    const thumbnailPath = req.file?.path;

    // save the course to db
    const course = await createCourse(courseData, thumbnailPath);
  
    return success(res, 201, "Course created successfully", course);
  } catch (err) {
    console.error("Error adding course:", err);
    return error(res, 500, "Server error", err.message);
  }
};

module.exports = handleCreateCourse;
