import { Request, Response } from "express";
import { logUserActivity } from "../../utilities/userActivities";
import employeesModel from "../models";
const { Employees } = employeesModel;


const DeleteEmployeesController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Employees Management']
    try {
        const { id } = req.params;
        const userToDelete = await Employees.findById(id);
        if(userToDelete){
            // const { firstName, lastName } = userToDelete;
            return res.status(400).json({
                status: true,
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

export default DeleteEmployeesController;