import * as enrollmentService from '../services/enrollment.service.js';

export const enroll = async (req, res) => {
  try {
    const enrollment = await enrollmentService.enrollInCourse(req.user.id, req.body.courseId);
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const myEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user.id);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const courseEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getCourseEnrollments(req.params.courseId);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};