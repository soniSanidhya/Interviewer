import { Candidate } from "../models/candidate.model.js";
import { Interviewer } from "../models/interviewer.model.js";

export const check = async (req, res) => {
  const { bodyData } = req.body;
  const { paramData } = req.params;
  const { queryParamData } = req.query;

  // console.log(bodyData, "  ", paramData, " ", queryParamData);

  if (!bodyData || !paramData || !queryParamData) {
    res.status(400).json({ message: "something went wrong" });
  }

  // console.log(req.user);

  res.status(200).json({ bodyData, paramData, queryParamData });
};

export const logoutUser = async (req, res) => {
  try {
    // Remove refreshToken from the user's record
    if (req.user.type === "interviewer") {
      await Interviewer.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
      });
    } else {
      await Candidate.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
      });
    }

    // Define cookie options matching those used during setting
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "None", // Required for cross-site cookies
      path: "/", // Ensure this matches the path used when setting the cookie
    };

    // Clear the cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
