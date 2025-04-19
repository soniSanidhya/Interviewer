import jwt from "jsonwebtoken";

export const generateAccessToken = async (data) => {
  const payload = { payload: data };
  // console.log(payload);

  // console.log(typeof payload);

  return await jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
};

export const verifyToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const generateRefreshToken = async (data) => {
  const payload = { payload: data };
  // console.log(payload);

  // console.log(typeof payload);
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
};

export const generateAccessAndRefreshToken = async (payload) => {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  if (!accessToken || !refreshToken) {
    throw new Error("Missing tokens: accessToken or refreshToken");
  }

  return { accessToken, refreshToken };
};
