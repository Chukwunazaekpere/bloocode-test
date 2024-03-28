import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config({path: "./src/config/config.env"})

const HOSPYTA_ADMIN_SECRET = process.env.HOSPYTA_ADMIN_SECRET as string;

export const generateAccessToken = async(payload: any) => {
    try {
        console.log("\n\t JWT in accessTokens file: ", HOSPYTA_ADMIN_SECRET)
        let accessToken = jwt.sign(payload, HOSPYTA_ADMIN_SECRET, {
            expiresIn: "1d",
        });
        return accessToken;
    } catch (error) {
        console.log("\n\t generateAccessToken-error: ", error);
    }
};

export function generateRandomCode(start: number, end: number) {
    return crypto.randomBytes(64).toString('hex').slice(start, end);
}

export const generatePasswordResetToken = async() => {
    try {
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const passwordResetToken = crypto
            .createHash("sha256")
            .update(resetPasswordToken)
            .digest("hex");
        const passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; // pick the current time and add 30 ie(30*60) minutes to it and convert to seconds by multiplying with 1000

        return {
            resetPasswordToken,
            passwordResetTokenExpires,
            passwordResetToken,
        };
    } catch (error) {
        console.log(error);
    }
};