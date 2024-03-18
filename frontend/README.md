## Description

This repo includes the frontend part of Job-Nest project.

## Project Setup

1. Cloned the repository with:

```
git clone <repo_url>
```

2. Install all required packages with

```
npm install
```

## Environment Variables

| Name               | Description                                    | Default Value         |
| ------------------ | ---------------------------------------------- | --------------------- |
| REACT_APP_BASE_URL | Base URL for the React application             | http://localhost:8080 |
| SONAR_URL          | URL for connecting to SonarQube server         | http://localhost:9000 |
| SONAR_TOKEN        | Token for authenticating with SonarQube server | <sonar_token>         |

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run coverage`

Runs Jest with coverage report generation. It watches all files for changes.

### `npm run sonarqube`

Executes the SonarQube scanner using the `sonarqube-scanner.js` script.
