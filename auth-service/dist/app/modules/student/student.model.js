"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.StudentSchema = void 0;
const mongoose_1 = require("mongoose");
const student_constants_1 = require("./student.constants");
exports.StudentSchema = new mongoose_1.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: {
      type: {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
      },
    },
    dateOfBirth: { type: String },
    gender: { type: String, enum: student_constants_1.gender },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: student_constants_1.bloodGroup,
    },
    guardian: {
      type: {
        fatherName: { type: String, required: true },
        fatherOccupation: { type: String, required: true },
        fatherContactNo: { type: String, required: true },
        motherName: { type: String, required: true },
        motherOccupation: { type: String, required: true },
        motherContactNo: { type: String, required: true },
        address: { type: String, required: true },
      },
    },
    localGuardian: {
      type: {
        name: { type: String, required: true },
        occupation: { type: String, required: true },
        contactNo: { type: String, required: true },
        address: { type: String, required: true },
      },
    },
    profileImage: { type: String },
    academicSemester: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "AcademicSemester",
      required: true,
    },
    academicDepartment: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "AcademicDepartment",
      required: true,
    },
    academicFaculty: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "AcademicFaculty",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
exports.Student = (0, mongoose_1.model)("Student", exports.StudentSchema);
