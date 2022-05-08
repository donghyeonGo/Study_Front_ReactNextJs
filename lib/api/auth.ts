import axios from ".";
import { SingUpAPIBody, LoginAPIBody } from "../../types/api/auth";
import { UserType } from "../../types/user";

//* 회원 가입 api
export const signupAPI = (body: SingUpAPIBody) =>
  axios.post<UserType>("/api/auth/signup", body);

export const loginAPI = (body: LoginAPIBody) =>
  axios.post<UserType>("/api/auth/login", body);

//* 로그 아웃 api
export const logoutAPI = () => axios.delete("/api/auth/logout");