import {Request, Response} from "express"

import usersModels from "../models";
const { Users } = usersModels;;
import { getMonth, todaysDate } from "date-fran";
import { logUserActivity } from "../../utilities/userActivities";
import { hashUserPassword } from "../../utilities/passwordManipulation";
import { UserTypeEnum } from "../models/Users";


const SystemInitialiserController =  async() => {
    console.log("\n\t SystemInitialiserController---", "\n")
    console.log("\n\t Creating Defaults...", );
    try {
        const [defaultUser, userId, hashedUserPassword] = await Promise.all([
            Users.findOne({
                firstname: String(process.env.BASE_ADMIN_USER_FIRSTNAME),
                lastname:  String(process.env.BASE_ADMIN_USER_LASTNAME),
                email: process.env.BASE_ADMIN_USER_EMAIL as string,
            }),
            Users.computeUsersId(),
            hashUserPassword(process.env.TEST_PASSWORD as string)
        ]);
        // console.log("\n\t Creating Defaults-2...", defaultUser);
        if (!defaultUser) {
            const initializer = {
                firstname: process.env.BASE_ADMIN_USER_FIRSTNAME,
                lastname: process.env.BASE_ADMIN_USER_LASTNAME,
                userType: UserTypeEnum.INT
            };
            await Promise.all([
                Users.create({
                    firstname: String(process.env.BASE_ADMIN_USER_FIRSTNAME),
                    lastname:  String(process.env.BASE_ADMIN_USER_LASTNAME),
                    email: process.env.BASE_ADMIN_USER_EMAIL as string,
                    username: process.env.TEST_USERNAME as string,
                    password: hashedUserPassword,
                    userId,
                    role: UserTypeEnum.INT,
                    phone: "00",
                    dateCreated: todaysDate(),
                    dateUpdated: todaysDate(),
                    monthRecord: getMonth(),
                    yearRecord: todaysDate().getFullYear(),
                    stringDate: todaysDate().toDateString()
                }),
                logUserActivity(initializer, `System initialization`)
            ]) 
            return true
        }
        throw new Error("Users exist.")
    } catch (error: any) {
        console.log(error);
        // process.exit(1)
    }
};

export default SystemInitialiserController;



