"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const mongoose_1 = __importDefault(require("mongoose"));
const student_constants_1 = require("./student.constants");
const student_model_1 = require("./student.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../users/user.model");
const getAllStudents = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTeam } = filters,
      filtersData = __rest(filters, ["searchTeam"]);
    const andConditions = [];
    if (searchTeam) {
      andConditions.push({
        $or: student_constants_1.StudentSearchAbleFields.map((field) => ({
          [field]: {
            $regex: searchTeam,
            $options: "i",
          },
        })),
      });
    }
    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers_1.paginationHelper.calculatePagination(
        paginationOptions
      );
    const sortCondition = {};
    if (sortBy && sortOrder) {
      sortCondition[sortBy] = sortOrder;
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield student_model_1.Student.find(whereConditions)
      .populate("academicSemester")
      .populate("academicDepartment")
      .populate("academicFaculty")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
    const total = yield student_model_1.Student.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getSingleStudent = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.findById(id)
      .populate("academicSemester")
      .populate("academicDepartment")
      .populate("academicFaculty");
    if (!result) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        "Student not found!"
      );
    }
    return result;
  });
const updateStudent = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield student_model_1.Student.findOne({ id });
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        "Student not found! Please"
      );
    }
    // 01- handle embedded
    const { name, guardian, localGuardian } = payload,
      studentData = __rest(payload, ["name", "guardian", "localGuardian"]);
    const updatedStudentData = Object.assign({}, studentData);
    // const name ={firstName:"Md",lastName:"kamruzzaman"}
    // 02- dynamically update // update user name
    if (name && Object.keys(name).length > 0) {
      Object.keys(name).forEach((key) => {
        const nameKey = `name.${key}`;
        updatedStudentData[nameKey] = name[key];
      });
    }
    // update Guardian
    if (guardian && Object.keys(guardian).length > 0) {
      Object.keys(guardian).forEach((key) => {
        const guardianKey = `guardian.${key}`;
        updatedStudentData[guardianKey] = guardian[key];
      });
    }
    // update LocalGuardian
    if (localGuardian && Object.keys(localGuardian).length > 0) {
      Object.keys(localGuardian).forEach((key) => {
        const localGuardianKey = `localGuardian.${key}`;
        updatedStudentData[localGuardianKey] = localGuardian[key];
      });
    }
    const result = yield student_model_1.Student.findOneAndUpdate(
      { id },
      updatedStudentData,
      {
        new: true, // return new document of the DB
      }
    );
    return result;
  });
const deleteStudent = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let deletedStudent = null;
    const session = yield mongoose_1.default.startSession();
    try {
      session.startTransaction();
      const isExist = yield student_model_1.Student.findOne({ id });
      if (!isExist) {
        throw new ApiError_1.default(
          http_status_1.default.NOT_FOUND,
          "Student not found! Please"
        );
      }
      // const newStudent = await Student.create([student], { session });
      const deleteUser = yield user_model_1.User.findOneAndDelete(
        { id },
        { session }
      );
      if (!deleteUser) {
        throw new ApiError_1.default(
          http_status_1.default.BAD_REQUEST,
          "Failed to delete user"
        );
      }
      //set student -->  _id into user.student
      // user.student = newStudent[0]._id;
      deletedStudent = yield student_model_1.Student.findOneAndDelete(
        { id },
        { session }
      )
        .populate("academicSemester")
        .populate("academicDepartment")
        .populate("academicFaculty");
      if (!deletedStudent) {
        throw new ApiError_1.default(
          http_status_1.default.BAD_REQUEST,
          "Failed to create user"
        );
      }
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return deletedStudent;
  });
exports.StudentService = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
