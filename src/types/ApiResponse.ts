import { ServiceRequest } from "@/models/user.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  request?: ServiceRequest
}
