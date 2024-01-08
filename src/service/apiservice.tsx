import Repository from './axiosConfig';

const resource: string = '/';
export default {

    signUp(obj: any): Promise<any> {
    return Repository.post(`${resource}signup`, obj);
    },
    signIn(obj: any): Promise<any> {
        return Repository.post(`${resource}signIn`, obj);
  }
}