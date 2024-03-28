import { Request, response, Response } from "express";
import { generateAccessToken } from "../../utilities/accessTokens";

import usersModels from "../models";
const { Users, Tokens } = usersModels;

import { decryptPassword } from "../../utilities/passwordManipulation";
import { logUserActivity } from "../../utilities/userActivities";
import { todaysDate } from "date-fran";
import { TokenPurposeEnum } from "../models/Tokens";



// console.log("\n\t principalURL: ", principalURL)
const LoginController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Users Management']
    console.log("\n\t LoginController: ", req.body);

    const { username, password } = req.body;
    // console.log("\n\t Username: ", Username)
    try {
        // console.log((`${principalURL}/users/verify-companys-licesnse/${clientsDomain}`))
        const user = await Users.findOne({username: username});
        if (!user) {
            console.log("\n\t user error: ",)
            return res.status(400).json({
                status: "Error",
                message: "Invalid user credentials"
            });
        };
        console.log("\n\t Request-body: ", req.body)
        // const { status } = user;
        // if (status.toLowerCase() === "fires") {
        //     console.log("\n\t user error: ", user)
        //     return res.status(401).json({
        //         status: "Error",
        //         message: "Your account has been suspended. Please contact your I.T administator."
        //     });
        // };
        if (!(await decryptPassword(password, user.password))) {
            return res.status(403).json({
                status: "Error",
                message: "Invalid user credentials"
            });
        };
        const payLoad = {
            user: {
                id: user.id,
            },
        };
        const accessToken = await generateAccessToken(payLoad)
        
        // console.log("\n\t Lic Details: ", licenseDetails)
        await Promise.all([
            Users.findByIdAndUpdate(user._id, {
                lastSeen: todaysDate(),
                dateUpdated: todaysDate()
            }, {useFindAndModify: false}),
            Tokens.create({
                dateCreated: todaysDate(), 
                tokenPurpose: TokenPurposeEnum.AUTH, 
                stringDate: todaysDate(), 
                token: accessToken, 
                userId: user._id,
            }),
            logUserActivity(user, `User management: ${user.firstname} ${user.lastname} logged in`, req)
        ]) 
        //  to send token as cookie to the browser  use the code below
        res.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + +`${process.env.NODE_ENV == "development" ? 2 : 90}` * 24 * 60 * 60 * 1000), //expires in 15days
            httpOnly: true,
            
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https', //used only in production
        });
        //end of code to send token as cookie
        // console.log("\n\t Logo: ", logo);
        res.locals.user = user;
        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                accessToken,
                user,
            },
        });
    } catch (error: any) {
        console.log("\n\t Login error: ", error.message);
        return res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
};


export default LoginController;