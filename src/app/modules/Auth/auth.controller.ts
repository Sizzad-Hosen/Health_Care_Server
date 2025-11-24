import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import ApiError from "../../errors/ApiError";
import { AuthServices} from "./auth.service";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const loginUser = catchAsync(async (req, res) => {

    
  const result = await AuthServices.loginUser(req.body);
console.log("result", result)
  const { refreshToken } = result;


  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful!",
    data: result,
  });
});



const refreshToken = catchAsync(async (req, res) => {

    const { refreshToken } = req.cookies;

    console.log(req.cookies)

    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange
        // }
    })
});

const changePasword = catchAsync(async (req, res) => {

    
  const user = req.user;
console.log("user", user, req.body)
    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed successfully",
        data: result
    })
});
const forgotPasword = catchAsync(async (req, res) => {

   await AuthServices.forgotPassword( req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Please check email sent a reset link",
        data: null
    })
});

export const resetPassword = catchAsync(async (req, res) => {


  let token = req.headers.authorization || req.body.token;

  console.log("Authorization Header:", req.headers.authorization);

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reset token is required");
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  console.log("Reset Token body:", token);
  console.log("Request Body:", req.body);

  await AuthServices.resetPassword(token, req.body); // <-- service must verify with reset secret

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: null,
  });
});


export const AuthControllers = { loginUser, refreshToken, resetPassword,changePasword , forgotPasword};
