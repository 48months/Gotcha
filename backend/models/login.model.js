class Login {
    constructor(loginData) {
        this.username = loginData.username;
        this.password = loginData.password;
        this.twofactorEnabled = loginData.twofactorEnabled;
        this.twofactorLoginToken = loginData.twofactorLoginToken;
        this.twofactorSecretToken = loginData.twofactorSecretToken;
        this.empId = loginData.empId;
        this.name = loginData.name;
        this.emailVerified = loginData.emailVerified;
    }
}

module.exports = Login;
