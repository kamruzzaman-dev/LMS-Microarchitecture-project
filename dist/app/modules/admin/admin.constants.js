"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFilterAbleFields = exports.AdminSearchAbleFields = exports.bloodGroup = exports.gender = void 0;
exports.gender = ["male", "female"];
exports.bloodGroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
exports.AdminSearchAbleFields = [
    "id",
    "email",
    "name.firstName",
    "name.middleName",
    "name.lastName",
    "year",
];
exports.AdminFilterAbleFields = [
    "searchTeam",
    "id",
    "gender",
    "bloodGroup",
    "email",
    "contactNo",
    "name",
    "emergencyContactNo",
];
