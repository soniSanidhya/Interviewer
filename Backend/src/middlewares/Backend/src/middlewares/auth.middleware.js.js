import { verifyToken } from "../../../../config/jwt.config.js";
import { Interviewer } from "../../../../models/interviewer.model.js";

export const verifyJWT = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    res.status(401).json("invalid access token");
  }

  const decodedToken = verifyToken(accessToken);

  const user = await Interviewer.findById(decodedToken.payload).select(
    "-passwordHash -accessToken -refreshToken"
  );

  if (!user) {
    res.status(401).json("no user found");
  }

  req.user = user;

  next();
};
