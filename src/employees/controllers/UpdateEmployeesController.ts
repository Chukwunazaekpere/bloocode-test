import { Request, Response } from "express";
import { hashUserPassword } from "../../utilities/passwordManipulation";
import { generateLoggedInUserIdFromRequest, logUserActivity } from "../../utilities/userActivities";

import employeesModel from "../models";
const { Employees } = employeesModel;

import { todaysDate } from "date-fran";



const UpdateEmployeesController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Employees Management']
    const adminUser = req.user as any;
    console.log("\n\t UpdateEmployeesController: ", req.body);
    console.log("\n\t Oriigin: ", req.headers['origin']?.split("//")[1])
    try {
        const { firstname, lastname, username, password, workStatus, role, confirmPassword } = req.body;
        const usersId = req.params.id;
        const userToUpdate = await Employees.findById(usersId);
        let errorMessage = "HotelPro could not find user";
        if(userToUpdate){
            console.log("\n\t userToUpdate: ", userToUpdate);
            // errorMessage = "You can't assign this role to a user";
            if((password && confirmPassword) && (confirmPassword !== password)){
                return res.status(403).json({
                    status: "Error",
                    message: "Password descrepancy: Both password fields must match."
                })
            };
            const [isSuperAdminUser, authorizedUser] = await Promise.all([
                Employees.findById(req.params.id),
                generateLoggedInUserIdFromRequest(req)
            ]);
            const hashedPassword = (password && confirmPassword) ? await hashUserPassword(password) : userToUpdate.password;
            const empFirstname = firstname ? firstname : userToUpdate.firstname;
            const empLastname = lastname ? lastname : userToUpdate.lastname;
            await Promise.all([
                Employees.findByIdAndUpdate(usersId, {
                    ...req.body,
                    firstname: empFirstname, 
                    lastSeen: todaysDate(),
                    workStatus: (workStatus && workStatus.toLowerCase()) === "active" ? "On-Duty" : workStatus,
                    lastname: empLastname,
                    username: username ? username : userToUpdate.username,
                    userRole: role ? role : userToUpdate.userType,
                    password: hashedPassword,
                    dateUpdated: todaysDate(),
                    updatedBy: authorizedUser,
                }, {useFindAndModify: false}),
                logUserActivity(adminUser, `User management: Updated users data: ${firstname} ${lastname} data`, req)
            ]);
            return res.status(200).json({
                status: true,
                message: `${firstname} ${lastname}'s data was successfully updated.'`
            });
        }
        throw new Error(errorMessage);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default UpdateEmployeesController;
