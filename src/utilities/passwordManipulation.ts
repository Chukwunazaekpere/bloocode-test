import bcrypt from "bcryptjs";

//function to hash user passwords
export const hashUserPassword = async(password: any) => {
    try {
        const saltRound = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, saltRound);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

//function to decrypt hashed password and compare with user entererd password
export const decryptPassword = async(enteredPassword: any, hashedPassword: any) => {
    try {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    } catch (error) {
        console.log(error);
        return false
    }
};