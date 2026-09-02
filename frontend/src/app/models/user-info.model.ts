export class UserInfo {
  username: string;
  name: string;
  empId: number;
  role: string;
  constructor(username: string, name: string, empId: number, role: string) {
    this.username = username;
    this.name = name;
    this.empId = empId;
    this.role = role;
  }
}
