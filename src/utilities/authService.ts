import dotenv from "dotenv";
import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

import usersModels from "../users/models";
const { Users } = usersModels;

dotenv.config({path: "./src/config/config.env"})
const TEST_ADMIN_SECRET = process.env.TEST_ADMIN_SECRET as string;

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    // console.log("\n\t authenticate middlewware-user: ", req.headers);
    try {
        //more robust implementation
        let accessToken;
        //check if token was sent along with the request and also that the user 
        // used the right authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            accessToken = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.accessToken) {
            accessToken = req.cookies.accessToken;
        }
        //check if the access token actually exist
        let errorMessage = `Acesss denied, No authorization token`;
        if(accessToken){
            //decode the acesss token
            console.log("\n\t accessToken: ", accessToken)
            const actualAccessToken = accessToken.split(process.env.ACCESS_TOKEN_SPLIT_SECRET)[0]
            console.log("\n\t Server-actualAccessToken: ", actualAccessToken);
            const decodedToken = jwt.verify(actualAccessToken, TEST_ADMIN_SECRET) as jwt.JwtPayload;
            console.log("\n\t Server-decodedToken: ", decodedToken);
            //check if user exist   just to be sure the user had not been deleted
            const user = await Users.findById(decodedToken.user.id);
            console.log("\n\t authenticate middlewware-user: ", user);
            errorMessage = `Acesss denied, Users with the token might have been deleted or deactivated`
            if(user){
                req.user = {}as any;
                req.user.firstname = user.firstname;
                req.user.lastname = user.lastname;
                req.user._id = user._id as any;;
                // console.log("\n\t Remote-IP: ", req.socket.remoteAddress);
                res.locals.user = user;
                next();
            };
        }
        throw new Error();
    } catch (error: any) {
        console.log(error);
        if (error.message.includes("jwt expired")) {
            return `Token expired. Please login again.`
        }
        return `Invalid accessToken`;
        // next(error.message)
    }
};


/**
 * A middleware for validating that a user is logged-in,
 * before being allowed to perform an operation
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    // let accessToken: string;
    // console.log("\n\t Users in isLoggedIn...", req.cookies);
    console.log("\n\t isLoggedIn req.cookies: ", req.cookies);
    const accessToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";
    req.cookies = {}as any;
    req.cookies['accessToken'] = accessToken;
    if (req.cookies.accessToken) {
        try {
            // accessToken = req.cookies.accessToken;
            console.log("\n\t isLoggedIn req.cookies: ", req.cookies);
            //decode the acesss token
            const actualAccessToken = accessToken.split(process.env.ACCESS_TOKEN_SPLIT_SECRET as string)[0]
            const decodedToken = jwt.verify(actualAccessToken, TEST_ADMIN_SECRET) as jwt.JwtPayload;
            //check if user exist just to be sure the user had not been deleted
            const user = await Users.findById(decodedToken.user.id);
            if(!user) throw new Error("Unrecognised user.")
            // console.log("\n\t found Users in isLoggedIn: ",);
            req.user._id = user._id as any;
            req.user.firstname = user.firstname
            req.user.lastname = user.lastname
            // console.log("\n\t Users in isLoggedIn...", req.cookies);
            return next();
        } catch (error) {
            return next()
        }
    }
    return next()
};

export const authorize = (userType: string[]) => {
    // console.log("\n\t Request in authorize: ",);
    return(req: Request, res: Response, next: NextFunction) => {
        if(!userType.includes(req.user.userType)) {
            const message = `Sorry you are forbidden to carry out this operation`;
            return res.status(403).json(message);
        }
        next();
    }
};



export const generateLoggedInUserIdFromRequest = async(req: Request): Promise<string | null> => {
    try {
        // console.log("\n\t generate logged user: ", req.user)
        const { firstname, lastname } = req.user;
        const user = await Users.findOne({
            firstname,
            lastname
        });
        if(user){
            return String(user._id)
        }
        throw new Error("Unrecognised user")
    } catch (error) {
        return null
    }
}
