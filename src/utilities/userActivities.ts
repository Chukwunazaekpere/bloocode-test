import { Request } from "express"
import { getMonth, todaysDate } from "date-fran";
import * as crypto from "crypto"
import UserLogs from "../users/models/UserLogs";
import User from "../users/models/Users";

// import usersModels from "../users/models";
// import usersModels from "../users/models";
// const { UserLogs, Users } = usersModels



export const logUserActivity = async(userData: any, operation: string, req?: Request) => {
    try {
        const { firstname, lastname, userType } = userData;
        const [logId, user] = await Promise.all([
            UserLogs.computeUsersLogId(),
            User.findOne({firstname} && {lastname})
        ]);
        const userFullname = `${firstname} ${lastname}`
        if(user){
            const createdLog = await UserLogs.create({
                userFullname,
                userRole: userType,
                ipAddress: "0.0.0",
                operation,
                stringDate: todaysDate().toDateString(),
                logId,
                monthRecord: getMonth(todaysDate()),
                yearRecord: todaysDate().getFullYear(),
                dateCreated: todaysDate()
            });
            console.log("\n\t logUserActivity-createdLog: ", createdLog);
        }
    } catch (error) {
        console.log("\n\t logUserActivity: ", error);
    }
};

export const generateUsernameFromRequest = (user: any): string => {
    try {
        const { firstname, lastname } = user;
        const fullname = (firstname as string).concat(" ", lastname);
        return fullname;
    } catch (error) {
        return ""
    }
}

export const generateLoggedInUserIdFromRequest = async(req: Request): Promise<string | null> => {
    try {
        // console.log("\n\t generate logged user: ", req.user)
        const { firstname, lastname } = req.user;
        const user = await User.findOne({
            firstname,
            lastname
        });
        if(user){
            return user._id as any
        }
        throw new Error("Unrecognised user")
    } catch (error) {
        return null
    }
};

export const randomIdGenerator = (start: number, end: number) => {
    if(end > 64) return `The end parametre ${end}; must not be greater than 64.`
    const generatedRandomNumber = crypto.randomBytes(32).toString('hex')
    return generatedRandomNumber.slice(start, end)
}