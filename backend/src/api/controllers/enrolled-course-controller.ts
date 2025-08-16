import { Request, Response } from "express";
import { AuthRequest } from "@/interfaces";
import EnrolledCourse from "../models/enrolled-course-model";

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  const userId = req.user;
  const { courseId } = req.params;

  try {
    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ error: "User ID and Course ID are required" });
    }

    const existingEnrollment = await EnrolledCourse.findOne({
      student: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in this course" });
    }

    const enrolledCourse = await EnrolledCourse.create({
      student: userId,
      course: courseId,
    });

    return res.status(201).json({
      data: enrolledCourse,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return res.status(500).json({ error: "Failed to enroll in course" });
  }
};

export const getEnrolledCourseIds = async (req: AuthRequest, res: Response) => {
  const userId = req.user;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const enrolledCourseIds = await EnrolledCourse.find({
      student: userId,
    }).select("course");

    const count = await EnrolledCourse.countDocuments({ student: userId });

    return res.status(200).json({
      data: enrolledCourseIds,
      message: "Enrolled courses retrieved successfully",
      count,
    });
  } catch (error) {
    console.error("Error retrieving enrolled courses:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve enrolled courses" });
  }
};

export const unenrollFromCourse = async (req: AuthRequest, res: Response) => {
  const userId = req.user;
  const { courseId } = req.params;

  try {
    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ error: "User ID and Course ID are required" });
    }

    const result = await EnrolledCourse.findOneAndDelete({
      student: userId,
      course: courseId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ error: "Enrollment not found or already deleted" });
    }

    return res.status(200).json({
      message: "Successfully unenrolled from the course.",
    });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    return res.status(500).json({ error: "Failed to unenroll from course" });
  }
};
