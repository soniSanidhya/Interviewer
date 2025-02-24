import { comparePassword, hashPassword } from "../config/bcrypt.config.js";
import { generateAccessAndRefreshToken } from "../config/jwt.config.js";
import { Interviewer } from "../models/interviewer.model.js";

export const interviewerSignup = async (req, res) => {
  const { userName, fullName, email, company, position, password, role } =
    req.body;

  console.log(req.body);

  if (
    !userName ||
    !fullName ||
    !email ||
    !company ||
    !position ||
    !password ||
    !role
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExisted = await Interviewer.findOne({ userName });

  if (userExisted) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await hashPassword(password);

  const newUser = {
    userName,
    fullName,
    email,
    company,
    position,
    passwordHash,
    role,
  };

  const createdUser = await Interviewer.create(newUser);

  if (!createdUser) {
    return res.status(400).json({ message: "Error creating user" });
  }

  return res
    .status(201)
    .json({ message: "User created successfully", user: createdUser });
};

export const interviewerLogin = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await Interviewer.findOne({ userName });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const hashedPassword = user.passwordHash;
  const comparedPassword = await comparePassword(password, hashedPassword);

  if (!comparedPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const planeUserId = user._id.toString();
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    planeUserId
  );

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  const loggedInaInterviewer = await Interviewer.findById(user._id).select(
    "-passwordHash -refreshToken -accessToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Login successful",
      user: { loggedInaInterviewer, accessToken, refreshToken },
    });
};
