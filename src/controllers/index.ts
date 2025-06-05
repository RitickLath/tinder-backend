import { Logout, VerifyOTP, GenerateOTP } from "./auth.controller";
import { createProfile, updateProfile } from "./profile.controller";

export { Logout, VerifyOTP, GenerateOTP, createProfile, updateProfile };

// HTTP_STATUS.OK                     // 200
// HTTP_STATUS.CREATED                // 201
// HTTP_STATUS.BAD_REQUEST            // 400
// HTTP_STATUS.UNAUTHORIZED           // 401
// HTTP_STATUS.FORBIDDEN              // 403
// HTTP_STATUS.NOT_FOUND              // 404
// HTTP_STATUS.INTERNAL_SERVER_ERROR  // 500
