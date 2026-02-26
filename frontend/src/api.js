import axios from "axios";

const BASE_URL = "http://localhost:8080";
// or your ngrok URL

export const signIn = async () => {
  const res = await axios.get(`${BASE_URL}/api/sign-in`);
  return res.data;
};

export const getVerificationStatus = async (id) => {
  const res = await axios.get(
    `${BASE_URL}/api/verificationstatus/${id}`
  );
  return res.data;
};