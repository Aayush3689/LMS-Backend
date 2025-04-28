const courseModel = require("../models/courses.model");

const handleAddCourse = async (req, res) => {
  try {
    const { courseDetail } = req.body;
    const thumbnail = req.file;

    // Check if courseDetail is present
    if (!courseDetail) {
      return res.status(400).json({
        success: false,
        message: "Course detail not found",
      });
    }

    // Check if thumbnail is present
    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail not found",
      });
    }

    // Thumbnail file path
    const thumbnailLink = `/uploads/${thumbnail.filename}`;

    // Construct final data
    const data = {
      ...JSON.parse(courseDetail),
      thumbnail: thumbnailLink,
    };

    // Save to DB
    const course = new courseModel(data);
    await course.save();

    console.log("course", course);

    return res.status(201).json({
      success: true,
      message: "Course added successfully",
      course,
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
