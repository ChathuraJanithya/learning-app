type BaseUser = {
  email: string;
};

export type LoggingUser = BaseUser & {
  password: string;
  // Add other properties specific to logged-in users
};

export type SignUpUser = BaseUser & {
  firstName: string;
  lastName: string;
  contact: string;
  role: string;
  password: string;
};

export type LoggedInUser = BaseUser & {
  role: "student" | "instructor";
  name: string;
  token: string;
};

export type LoginResponse = {
  status: number;
  data: {
    token: string;
    user: {
      email: string;
      name: string;
      role: "student" | "instructor";
    };
  };
};

export type Course = {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  content: string;
  createdAt: Date;
};

export type enrolledCourseIds = {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
};
