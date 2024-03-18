require("dotenv").config();
const scanner = require("sonarqube-scanner");

const sonarPort = process.env.SONAR_URL;
const userToken = process.env.SONAR_TOKEN;

scanner(
  {
    serverUrl: sonarPort,
    token: userToken,
    options: {
      "sonar.sources": "./src",
      "sonar.exclusions": "**/__test__/**",
    },
  },
  () => process.exit()
);
