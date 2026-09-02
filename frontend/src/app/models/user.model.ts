export class User {
  username: string;
  password: string;
  name: '';
  empId: null;
  twofactorEnabled: false;
  constructor(username, password, name, empId, twofactorEnabled) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.empId = empId;
    this.twofactorEnabled = twofactorEnabled;
  }
}
