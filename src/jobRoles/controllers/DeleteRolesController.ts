import { Request, Response } from "express";
import { logUserActivity } from "../../utilities/userActivities";
import roleModels from "../models";
const { Roles } = roleModels;


const DeleteRolesController = async(req: Request, res: Response) => {
       // #swagger.tags = ['Job-Role Management']

    try {
        const { id } = req.params;
        const userToDelete = await Roles.findById(id);
        if(userToDelete){
            // const { firstName, lastName } = userToDelete;
            return res.status(400).json({
                status: "Error",
                message: "Deleted successfully"
            })
        };
        throw new Error("Unrecognised user.");
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default DeleteRolesController;