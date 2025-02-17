interface Config {
  API_URL: string;
  PUBLIC_URL: string;
  APP_NAME: string;
}

const apiUrl = "http://localhost:8000/api";
const publicUrl = "http://localhost:8000";

const config: Config = {
  API_URL: apiUrl,
  PUBLIC_URL: publicUrl,
  APP_NAME: "Organic-shop",
};

export default config;
