import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      username?: string;
      fullname?:string;
      avatar?:string;
      role?:string;
      phone?:string;
    } & DefaultSession["user"];
  }
  interface User {
    _id?: string;
    isVerified?: boolean;
    username?: string;
    fullname?:string;
    avatar?:string;
    role?:string;
    phone?:string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    username?: string;
    fullname?:string;
    avatar?:string;
    role?:string;
    phone?:string;
  }
}
