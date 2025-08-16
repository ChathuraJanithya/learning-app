import { Request, Response } from "express";
import Course from "@/api/models/course-model";
import { AuthRequest } from "@/interfaces";

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = new Course(req.body);
    //only instructors can create courses

    if (req.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }
    // Set the instructor to the authenticated user
    if (!req.user) {
      return res.status(400).json({ error: "Authenticated user ID not found" });
    }

    course.instructor =
      typeof req.user === "string" ? (req.user as any) : req.user;

    // Save the course
    await course.save();
    res
      .status(201)
      .json({ message: "Course created successfully", data: course });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    //only instructors can delete courses
    //@ts-ignore
    if (req.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Delete successful", data: "" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const getCourseByInstructorId = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { instructorId } = req.params;

    // Determine instructorId: either param or authenticated user
    const resolvedInstructorId = instructorId || req.user;

    if (!resolvedInstructorId) {
      return res.status(400).json({ error: "Instructor ID not provided" });
    }

    // Authorization: only allow instructors to see their own courses if no param
    if (!instructorId && req.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }

    const courses = await Course.find({ instructor: resolvedInstructorId });
    const count = await Course.countDocuments({
      instructor: resolvedInstructorId,
    });
    res.status(200).json({
      data: courses,
      count: count,
      message: "Courses retrieved successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find();
    const count = await Course.countDocuments();
    res.status(200).json({
      data: courses,
      count: count,
      message: "All courses retrieved successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
