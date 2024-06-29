## Description

This repo includes the backend part of Job-Nest project and uses Node v20.

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

| Name       | Description                              | Default Value |
| ---------- | ---------------------------------------- | ------------- |
| DEV_MODE   | Mode of the application                  | development   |
| PORT       | Port on which the server will listen     | 8080          |
| JWT_SECRET | Secret key used for JWT token encryption | <secret_key>  |
| MONGO_URL  | URL for connecting to MongoDB            | <mongo_url>   |

## Available Scripts

### `npm test`

Runs the Jest test runner to execute tests.

### `npm run coverage`

Runs Jest with coverage report generation. It watches all files for changes.

### `npm run lint`

Lints TypeScript files in the `src` directory using ESLint.

### `npm run lint:fix`

Fixes linting issues in TypeScript files in the `src` directory using ESLint.

### `npm run prepare`

Installs Husky, a Git hooks manager.

### `npm start`

Starts the application using `nodemon` and executes `ts-node` to run `src/index.ts`.

### `npm run sonarqube`

Executes the SonarQube scanner using the `sonarqube-scanner.js` script.
