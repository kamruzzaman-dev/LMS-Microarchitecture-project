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
exports.ManagementDepartmentService = void 0;
const managementDepartment_constants_1 = require("./managementDepartment.constants");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const managementDepartment_model_1 = require("./managementDepartment.model");
const createManagementDepartment = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield managementDepartment_model_1.ManagementDepartment.create(payload);
    return result;
  });
const getAllManagementDepartments = (filters, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTeam } = filters,
      filtersData = __rest(filters, ["searchTeam"]);
    const andConditions = [];
    if (searchTeam) {
      andConditions.push({
        $or: managementDepartment_constants_1.managementDepartmentSearchableFields.map(
          (field) => ({
            [field]: {
              $regex: searchTeam,
              $options: "i",
            },
          })
        ),
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
    const result = yield managementDepartment_model_1.ManagementDepartment.find(
      whereConditions
    )
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
    const total =
      yield managementDepartment_model_1.ManagementDepartment.countDocuments(
        whereConditions
      );
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  });
const getSingleManagementDepartment = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield managementDepartment_model_1.ManagementDepartment.findById(id);
    if (!result) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        "Management Department not found!"
      );
    }
    return result;
  });
const updateManagementDepartment = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield managementDepartment_model_1.ManagementDepartment.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true, // return new document of the DB
        }
      );
    return result;
  });
const deleteManagementDepartment = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield managementDepartment_model_1.ManagementDepartment.findByIdAndDelete(
        { _id: id }
      );
    if (!result) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        "Management Department not found!"
      );
    }
    return result;
  });
exports.ManagementDepartmentService = {
  createManagementDepartment,
  getAllManagementDepartments,
  getSingleManagementDepartment,
  updateManagementDepartment,
  deleteManagementDepartment,
};
