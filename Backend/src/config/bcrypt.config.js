import bcrypt from "bcryptjs";
const saltRounds = 10;

export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const comparePassword = async (password, passwordHash) => {
    const comparedPassword = await bcrypt.compare(password, passwordHash);
    return comparedPassword;
}
