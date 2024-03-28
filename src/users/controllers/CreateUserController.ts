import { Request, Response } from "express";

import { hashUserPassword } from "../../utilities/passwordManipulation";
import usersModels from "../models";
const { Users } = usersModels;

import { generateLoggedInUserIdFromRequest, logUserActivity } from "../../utilities/userActivities";
import { todaysDate } from "date-fran";


const CreateUserController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Users Management']
    console.log("\n\t CreateUserController...", req.body)
    const adminUser = req.user;
    let statusCode = 403;
    try {
        const { firstname, lastname, username, password, workStatus, role, confirmPassword } = req.body;
        let errorMessage = "You can't assign this role to a user";
        if(!role.toLowerCase().includes('halogen')){
            errorMessage = `Both password and confirm-password must be same`;
            statusCode = 400;
            if(confirmPassword === password){
                const [usersFullname, usernameExists, userId, hashedPassword, authorizedUsersId] = await Promise.all([
                    Users.findOne({firstname: firstname, lastname: lastname}),
                    Users.findOne({username: username}),
                    Users.computeUsersId(),
                    hashUserPassword(password),
                    generateLoggedInUserIdFromRequest(req),
                ]);
                const authorizedUsersDetails = await Users.findById(authorizedUsersId)
                const { companyId } = authorizedUsersDetails as any;
                errorMessage = usersFullname ? `A user: ${firstname.concat(" ", lastname)} already exists. Please choose another name` : `The username: ${username} already exists. Please choose another username`;
                if (!usersFullname && !usernameExists) {
                    statusCode = 0;
                    await Promise.all([
                        Users.create({
                            ...req.body,
                            createdBy: authorizedUsersId,
                            updatedBy: authorizedUsersId,
                            lastSeen: todaysDate(),
                            firstname: firstname,
                            lastname: lastname,
                            userId,
                            username: username,
                            password: hashedPassword,
                            dateCreated: todaysDate(), 
                            dateUpdated: todaysDate(),
                            userType: role,
                        }),
                        logUserActivity(adminUser, `User management: Registered a new user: ${firstname} ${lastname}`, req)
                    ]);
                    return res.status(201).json({
                        status: "Success",
                        message: `Registration was successful. ${firstname} ${lastname} has been added to the ${role} department.`,
                    });
                };
            }
        };
        throw new Error(errorMessage);
    } catch (error: any) {
        console.log(error);
        return res.status(statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};


export default CreateUserController;