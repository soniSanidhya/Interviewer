import { hashPassword } from "../config/bcrypt.config.js";
import { Candidate } from "../models/candidate.model.js";

export const candidateSignup = async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (!userName || !fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExisted = await Candidate.findOne({ userName });

  if (userExisted) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await hashPassword(password);

  const newUser = {
    userName,
    fullName,
    email,
    passwordHash,
  };

  const createdUser = await Candidate.create(newUser);

  if (!createdUser) {
    return res.status(400).json({ message: "Error creating user" });
  }

  return res
    .status(201)
    .json({ message: "User created successfully", user: createdUser });
};

export const AccessInterviewForCandidate = async (req, res) => {
  //take token from param, containing schedule time, interview id
  //verify time with secret
  //take email passw from user
  //verify
  //give entry with candidate attached as user data like user data and room id
};
