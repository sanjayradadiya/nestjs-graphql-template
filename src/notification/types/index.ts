export interface ReportDataType {
  fullName: string;
  RemainingLeaves: number;
  totalTime: string;
  checkOut: string | null;
  checkIn: string;
  id: string;
  leave: string;
  valid: boolean;
  firebaseToken: string;
  message?: string;
}

export enum TypesOfReport {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
  REMINDER = 'REMINDER',
}
export interface ReportType {
  dataTime: ReportDataType[];
  type: TypesOfReport;
}
