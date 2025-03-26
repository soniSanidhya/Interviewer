import { verifyToken } from "../../../../config/jwt.config.js";
import { Candidate } from "../../../../models/candidate.model.js";
import { Interviewer } from "../../../../models/interviewer.model.js";

export const verifyJWT = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: "Invalid access token" });
  }

  let decodedToken;
  try {
    decodedToken = await verifyToken(accessToken);  
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  let user = await Interviewer.findById(decodedToken.payload).select(
    "-passwordHash -accessToken -refreshToken"
  );

  if (user) {
    user = { ...user.toObject(), type: "interviewer" };  // Explicitly add type
  } else {
    user = await Candidate.findById(decodedToken.payload).select(
      "-passwordHash -accessToken -refreshToken"
    );

    if (user) {
      user = { ...user.toObject(), type: "candidate" };  // Explicitly add type
    }
  }

  if (!user) {
    return res.status(401).json({ message: "No user found" });
  }

  req.user = user;
  next();
};
