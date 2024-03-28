import { Request, Response } from "express";
import { logUserActivity } from "../../utilities/userActivities";
import usersModels from "../models";
const { Users } = usersModels;


const DeleteUserController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Users Management']
    try {
        const { id } = req.params;
        const userToDelete = await Users.findById(id);
        if(userToDelete){
            const { firstname, lastname } = userToDelete;
            return res.status(200).json({
                status: true,
                message: "Successful"
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

export default DeleteUserController;