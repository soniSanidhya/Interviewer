import { verifyToken } from "../../../../config/jwt.config.js";
import { Candidate } from "../../../../models/candidate.model.js";
import { Interviewer } from "../../../../models/interviewer.model.js";

export const verifyJWT = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    console.error("Access token is missing in cookies");
    return res.status(401).json({ message: "Invalid access token" });
  }

  let decodedToken;
  try {
    decodedToken = await verifyToken(accessToken);
    // console.log("Token successfully decoded:", decodedToken);
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  let user;
  try {
    user = await Interviewer.findById(decodedToken.payload).select(
      "-passwordHash -accessToken -refreshToken"
    );

    if (user) {
      // console.log("Interviewer found:", user._id);
      user = { ...user.toObject(), type: "interviewer" }; // Explicitly add type
    } else {
      // console.log("No interviewer found, checking for candidate...");
      user = await Candidate.findById(decodedToken.payload).select(
        "-passwordHash -accessToken -refreshToken"
      );

      if (user) {
        // console.log("Candidate found:", user._id);
        user = { ...user.toObject(), type: "candidate" }; // Explicitly add type
      }
    }
  } catch (error) {
    console.error("Error querying database:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }

  if (!user) {
    console.error("No user found for the provided token payload");
    return res.status(401).json({ message: "No user found" });
  }

  // console.log("User successfully authenticated:", user._id, "Type:", user.type);
  req.user = user;
  next();
};
