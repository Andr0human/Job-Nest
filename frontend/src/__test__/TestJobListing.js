import axios from "axios";

class TestJobListing {
  constructor() {
    this.testJobId = "";
    this.uniqueSuffix = `${Date.now()}`;
  }

  insertFakeEntry = async () => {
    try {
      this.testJobId = "";

      const response = await axios.post("http://localhost:8080/jobs", {
        title: `Test Title - ${this.uniqueSuffix}`,
        company: "Test Company",
        jobType: "Full-time",
        industry: "Computer Software",
        applicationDeadline: new Date(),
        isRemote: true,
        contactEmail: "test@company.com",
        applicationLink: "web.test-company.com",
        address: {
          city: "Noida",
          statte: "Delhi",
        },
        qualifications: {
          education: "B. Tech",
          skills: ["C", "C++", "Python"],
        },
        requirements: ["RQ-1", "RQ-2", "RQ-3"],
        responsibilities: ["RS-1", "RS-2", "RS-3"],
      });

      this.testJobId = response.data.data._id;
    } catch (error) {
      console.log("error inserting fake user entry!", error);
    }
  };

  deleteFakeEntry = async (userToken) => {
    try {
      await axios.delete(`http://localhost:8080/jobs/${this.testJobId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      this.testJobId = "";
    } catch (error) {
      console.log("error deleting fake job listing!", error);
    }
  };

  id = () => {
    return this.testJobId;
  };

  title = () => {
    return `Test Title - ${this.uniqueSuffix}`;
  };
}

export default TestJobListing;
