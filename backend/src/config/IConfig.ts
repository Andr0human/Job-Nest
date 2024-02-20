interface IServerConfig {
  devMode: string;
  port: number;
  dummyToken: string;
  jwtSecret: string;
  mongoUrl: string;
}

export default IServerConfig;
