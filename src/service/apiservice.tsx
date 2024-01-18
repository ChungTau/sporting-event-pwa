import Repository from "./axiosConfig";

const resource: string = "/";

const api = {
  signUp(obj: any): Promise<any> {
    return Repository.post(`${resource}signup`, obj);
  },
  signIn(obj: any): Promise<any> {
    return Repository.post(`${resource}signIn`, obj);
  },
  forgotPassword(obj: any): Promise<any> {
    return Repository.post(`${resource}forgotPassword`, obj);
  },
  resetPassword(obj: any): Promise<any> {
    return Repository.post(`${resource}resetPassword`, obj);
  },
};
export default api;
