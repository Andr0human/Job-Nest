interface IServerConfig {
  devMode: string;
  port: number;
  jwtSecret: string;
  mongoUrl: string;
}

export default IServerConfig;
