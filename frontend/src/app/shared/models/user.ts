export class User {

  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  token?: string;

  constructor(id: number, username: string, password: string, firstName: string, lastName: string, token: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = firstName;
    this.lastName = lastName;
    this.token = token;
  }
}

