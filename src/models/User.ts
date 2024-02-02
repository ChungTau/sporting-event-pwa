import { BaseModel } from "./BaseModel";
import Credential from "./Credential";

interface User extends BaseModel, Credential{
    profilePic: Blob;
    nickname: string,
    username: string,
    gender: string,
    dob: string,
    phoneNumber: string,
    emergencyPerson: string,
    emergencyContact: string,
  }
  
  export default User;
  