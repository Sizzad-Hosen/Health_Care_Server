import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export const generateToken = (payload: any, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });
};

interface IJwtPayload extends JwtPayload {
  email: string;
  role: string;
}

export const verifyToken = async (token: string, secret: Secret): Promise<IJwtPayload> => {
  try {
    const decoded = jwt.verify(token, secret) as IJwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
