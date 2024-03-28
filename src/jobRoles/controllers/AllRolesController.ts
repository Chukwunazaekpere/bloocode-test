import { Request, Response } from "express";
import RolesModel from "../models";
const { Roles } = RolesModel;


const AllRolesController = async(req: Request, res: Response) => {
     // #swagger.tags = ['Job-Role Management']
    try {
        const roles = await Roles.find({})
        const { paginationStartPoint, paginationEndPoint} = req.params;

        const noRecord = "No roles currently"
        return res.status(200).json({
            status: true,
            data: {
                data: roles,
                serverRecordLength: roles.length ? roles.length : 0
            }
        });
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const FilterRolesController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Job-Role Management']
    console.log("\n\t FilterRolesController-req.body: ", req.body)
    const input = req.body.input;
    let filter = [] as any[];
    const roles = await Roles.find();
    const keys = [
        "rolename",
        "id"
    ]
    for(let role of roles){
        keys.forEach(key => {
            const val = (role as any)[key];
            if(String(val).toLowerCase().includes(input.toLowerCase())){
                // const logs = await UserLog.find({stringDate});
                console.log("\n\t FilterRolesController-role: ", role)
                !filter.includes(role) && filter.push(role);
            };
        })
    };
    return res.status(200).json({
        data: filter,
        status: true
    })
};

export default AllRolesController;