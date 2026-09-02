class ForgotUsers {
    constructor(forgotUsersData) {
      this.username = forgotUsersData.username;
      this.password = forgotUsersData.password;
      this.confirmPassword = forgotUsersData.password;
      this.twofactorEnabled = forgotUsersData.twofactorEnabled;
      this.twofactorLoginToken = forgotUsersData.twofactorLoginToken;
      this.twofactorSecretToken = forgotUsersData.twofactorSecretToken;
      this.verified = forgotUsersData.verified;
    }
  }
  
  module.exports = ForgotUsers;
  