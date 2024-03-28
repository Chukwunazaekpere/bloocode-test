import { Request, Response } from "express";

// import roleModels from "../models";
import roleModels from "../models";
const { Roles } = roleModels;

import { generateLoggedInUserIdFromRequest, logUserActivity } from "../../utilities/userActivities";
import { todaysDate } from "date-fran";


const CreateRoleController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Job-Role Management']

    console.log("\n\t CreateRoleController...", req.body)
    const adminUser = req.user;
    let statusCode = 403;
    try {
        const { rolename, roleDescription } = req.body;
        let errorMessage = "You can't assign this role to a user";
        errorMessage = `Both password and confirm-password must be same`;
        statusCode = 400;
        const [role, roleDescriptionExists, userId, authorizedroleId] = await Promise.all([
            Roles.findOne({rolename}),
            Roles.findOne({roleDescription}),
            Roles.computeRoleId(),
            generateLoggedInUserIdFromRequest(req),
        ]);
        errorMessage = role ? `A role: ${rolename} already exists. Please choose another name` : `The username: ${roleDescription} already exists. Please choose another username`;
        if (!role && !roleDescriptionExists) {
            statusCode = 0;
            await Promise.all([
                Roles.create({
                    ...req.body,
                    dateCreated: todaysDate(), 
                    dateUpdated: todaysDate(),
                }),
                logUserActivity(adminUser, `Role management: created a new role: ${rolename} ${roleDescription}`, req)
            ]);
            return res.status(201).json({
                status: true,
                message: `Role was successfully created.`,
            });
        };
        throw new Error(errorMessage);
    } catch (error: any) {
        console.log(error);
        return res.status(statusCode || 500).json({
            status: false,
            message: error.message,
        });
    }
};


export default CreateRoleController;