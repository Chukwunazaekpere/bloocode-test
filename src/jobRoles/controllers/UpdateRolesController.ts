import { Request, Response } from "express";
import { hashUserPassword } from "../../utilities/passwordManipulation";
import { generateLoggedInUserIdFromRequest, logUserActivity } from "../../utilities/userActivities";

import employeesModel from "../models";
const { Roles } = employeesModel;

import { todaysDate } from "date-fran";



const UpdateRolesController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Job-Role Management']

    const adminUser = req.user as any;
    console.log("\n\t UpdateRolesController: ", req.body);
    console.log("\n\t Oriigin: ", req.headers['origin']?.split("//")[1])
    try {
        const { firstname, lastname, username, password, workStatus, role, confirmPassword } = req.body;
        const usersId = req.params.id;
        const roleToUpdate = await Roles.findById(usersId);
        let errorMessage = "HotelPro could not find user";
        if(roleToUpdate){
            console.log("\n\t roleToUpdate: ", roleToUpdate);
            // errorMessage = "You can't assign this role to a user";
            await Promise.all([
                Roles.findByIdAndUpdate(roleToUpdate._id, {
                    ...req.body,
                    dateCreated: todaysDate(), 
                    dateUpdated: todaysDate(),
                }),
                logUserActivity(adminUser, `User management: Updated users data: ${firstname} ${lastname} data`, req)
            ]);
            return res.status(200).json({
                status: "Success",
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

export default UpdateRolesController;
