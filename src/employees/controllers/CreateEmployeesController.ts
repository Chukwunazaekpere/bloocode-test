import { Request, Response } from "express";

import { hashUserPassword } from "../../utilities/passwordManipulation";
// import usersModels from "../models";
import employeesModel from "../models";
const { Employees } = employeesModel;

import { generateLoggedInUserIdFromRequest, logUserActivity } from "../../utilities/userActivities";
import { todaysDate } from "date-fran";


const CreateEmployeeController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Employee Management']
    console.log("\n\t CreateEmployeeController...", req.body)
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
                    Employees.findOne({firstname: firstname, lastname: lastname}),
                    Employees.findOne({username: username}),
                    Employees.computeEmployeesId(),
                    hashUserPassword(password),
                    generateLoggedInUserIdFromRequest(req),
                ]);
                const authorizedUsersDetails = await Employees.findById(authorizedUsersId)
                const { companyId } = authorizedUsersDetails as any;
                errorMessage = usersFullname ? `A user: ${firstname.concat(" ", lastname)} already exists. Please choose another name` : `The username: ${username} already exists. Please choose another username`;
                if (!usersFullname && !usernameExists) {
                    statusCode = 0;
                    await Promise.all([
                        Employees.create({
                            ...req.body,
                            createdBy: authorizedUsersId,
                            updatedBy: authorizedUsersId,
                            lastSeen: todaysDate(),
                            firstname,
                            lastname,
                            userId,
                            username: username,
                            password: hashedPassword,
                            dateCreated: todaysDate(), 
                            dateUpdated: todaysDate(),
                            userRole: role,
                        }),
                        logUserActivity(adminUser, `User management: Registered a new user: ${firstname} ${lastname}`, req)
                    ]);
                    return res.status(201).json({
                        status: true,
                        message: `Registration was successful. ${firstname} ${lastname} has been added to the ${role} department.`,
                    });
                };
            }
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


export default CreateEmployeeController;