export const permissionArray = [
  //employee
  'employeeList',
  'currentUserDetails',
  'createEmployee',
  'updateEmployee',
  'resetRemainingLeaves',
  'removeEmployee',
];

import { registerEnumType } from '@nestjs/graphql';

// Define an enum for permissions
export enum PermissionEnum {
  ShowEmployee = 'ShowEmployee',
  AddEmployee = 'AddEmployee',
  EditEmployee = 'EditEmployee',
  ResetRemainingLeaves = 'ResetRemainingLeaves',
  DeleteEmployee = 'DeleteEmployee',
  RevertEmployee = 'RevertEmployee',

  ShowLeave = 'ShowLeave',
  AddLeave = 'AddLeave',
  EditLeave = 'EditLeave',
  DeleteLeave = 'DeleteLeave',
  ApproveLeave = 'ApproveLeave',
  AddHoliday = 'AddHoliday',
  EditHoliday = 'EditHoliday',
  DeleteHoliday = 'DeleteHoliday',
  ShowHoliday = 'ShowHoliday',

  ShowProfile = 'ShowProfile',
  ShowDashboard = 'ShowDashboard',
  ShowAttendance = 'ShowAttendance',
  ShowReport = 'ShowReport',
  ShowPermission = 'ShowPermission',
}

// Register the enum with GraphQL
registerEnumType(PermissionEnum, {
  name: 'Permission',
  description: 'Available permissions in the system.',
});

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  USER: 'User',
  HR: 'HR',
};
