import { BaseModel } from "./BaseModel";

interface User extends BaseModel{
    id: number;
    username: string;
    email: string;
    password: string;
  }
  
  export default User;
  