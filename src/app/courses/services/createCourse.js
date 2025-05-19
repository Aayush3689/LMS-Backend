const courseModel = require("../models/courses.model")

const createCourse = async (courseData, thumbnailPath) => {
    const coursePayload = {
        ...courseData,
        thumbnail: thumbnailPath
    }

    const course = new courseModel(coursePayload);
    return await course.save();

}

module.exports = createCourse;