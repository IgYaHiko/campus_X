import * as Department from "./department";
import * as Students from "./students";
import * as Staffs from "./staff";
import * as Categories from "./categories";
import * as Complaints from "./complaints";
import * as ComplaintComments from "./complaintComments";
import * as ComplaintStatusHistory from "./complaintStatusHistory";
import * as StaffDepartment from "./staffDepartments";
import * as Tags from  "./tags";
import * as ComplaintTags from "./complaintTags";

export {
  Department,
  Students,
  Staffs,
  Categories,
  Complaints,
  ComplaintComments,
  ComplaintStatusHistory,
  StaffDepartment,
  Tags,
  ComplaintTags
};

export const CAMPUS_X_SCHEMAS = {
  Department,
  Students,
  Staffs,
  Categories,
  Complaints,
  ComplaintComments,
  ComplaintStatusHistory,
  StaffDepartment,
  Tags,
  ComplaintTags,
} as const;