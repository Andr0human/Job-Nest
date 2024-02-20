import axios from "axios";

class TestUser {
  constructor() {
    this.testUserId = "";
    this.testUserToken = "";
    this.uniqueSuffix = `${Date.now()}`;
  }

  insertFakeEntry = async () => {
    try {
      this.testUserId = "";

      await axios.post("http://localhost:8080/users/register", {
        name: "Test User",
        password: "user@123",
        email: this.email(),
      });

      let response = await axios.post(`http://localhost:8080/users/login`, {
        email: this.email(),
        password: "user@123",
      });

      this.testUserId = response.data.data.existingUser._id;
      this.testUserToken = response.data.data.token;

      response = await axios.put(
        `http://localhost:8080/users/${this.testUserId}`,
        {
          name: "Test User",
          achievements: ["Ac-1", "Ac-2", "Ac-3"],
          dateOfBirth: new Date("1990-01-01"),
        },
        {
          headers: {
            Authorization: `Bearer ${this.testUserToken}`,
          },
        }
      );
    } catch (error) {
      console.log("error inserting fake user entry!", error);
    }
  };

  deleteFakeEntry = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/users/login`, {
        email: this.email(),
        password: "user@123",
      });

      this.testUserId = response.data.data.existingUser._id;

      await axios.delete(`http://localhost:8080/users/${this.testUserId}`, {
        headers: {
          Authorization: `Bearer ${this.token()}`,
        },
      });
      this.testUserId = "";
      this.testUserToken = "";
    } catch (error) {
      console.log("error deleting fake user entry!", error.message);
    }
  };

  userId = () => {
    return this.testUserId;
  };

  token = () => {
    return this.testUserToken;
  };

  name = () => {
    return "Test User";
  };

  email = () => {
    return `user-${this.uniqueSuffix}@test.com`;
  };

  password = () => {
    return "user@123";
  };
}

export default TestUser;
