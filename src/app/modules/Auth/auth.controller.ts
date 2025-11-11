import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { AuthServices} from "./auth.service";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req, res) => {

    
  const result = await AuthServices.login(req.body);
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

export const AuthControllers = { loginUser, refreshToken };
