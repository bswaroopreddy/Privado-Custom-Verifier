import axios from "axios";

export const getAuthRequest = async () => {
  const res = await axios.get(
    "http://localhost:8080/api/auth-request"
  );
  return res.data;
};