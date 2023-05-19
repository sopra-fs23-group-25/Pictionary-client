import axios from "axios";
import { getDomain } from "helpers/getDomain";

export const api = axios.create({
  baseURL: getDomain(),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const apiWithAuth = (token) =>
  axios.create({
    baseURL: getDomain(),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Auth-Token": token,
    },
  });

export const apiWithUserId = (userId) =>
  axios.create({
    baseURL: getDomain(),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      UserId: userId,
    },
  });

export const handleError = (error) => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    //let info = `\nrequest to: ${response.request.responseURL}`;
    let info = "";

    if (response.data.status) {
      // info += `\nstatus code: ${response.data.status}`;
      // info += `\nerror: ${response.data.error}`;
      //info += `\nerror message: ${response.data.message}`;
      info += response.data.message;
    } else {
      //info += `\nstatus code: ${response.status}`;
      //info += `\nerror message:\n${response.data}`;
      info += response.data.message;
    }

    console.log(
      "The request was made and answered but was unsuccessful.",
      error.response
    );
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      return "The server cannot be reached.\nDid you start it?";
    }

    console.log("Something else happened.", error);
    return error.message;
  }
};
