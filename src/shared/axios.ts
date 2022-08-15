import axios from "axios";
import { API_URL } from "./constants";

const instance = axios.create({
  baseURL: API_URL,
  params: {
    api_key: "e3bb99f79b1bb8906dac2d3227927c8f",
  },
});

export default instance;
