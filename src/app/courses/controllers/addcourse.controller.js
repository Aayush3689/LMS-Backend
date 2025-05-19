const courseModel = require("../models/courses.model");

const handleAddCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const thumbnail = req.file;

    
    if (!courseData) {
      return res.status(400).json({
        success: false,
        message: "Course data should not be empty",
      });
    }


    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail not found",
      });
    }

    // Save to DB
    const course = new courseModel(courseData);

    console.log("course", course);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = handleAddCourse;
