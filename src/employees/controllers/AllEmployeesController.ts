import { Request, Response } from "express";
import employeesModel from "../models";
import { userMgtHelper } from "../../users/controllers/AllUsersController";
const { Employees } = employeesModel;


const AllEmployeesController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Employees Management']
    try {
        const users = await Employees.find({})
        const { paginationStartPoint, paginationEndPoint} = req.params;

        const noRecord = "No users currently"
        return res.status(200).json({
            status: true,
            data: {
                data: users,
                serverRecordLength: users.length ? users.length : 0
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

export const GetEmployeeByIdController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Employees Management']
    try {
        const emppId = req.params.id;
        const employeeExists = await Employees.findById(emppId)
        if(employeeExists){
            return res.status(200).json({
                status: true,
                data: employeeExists
            });
        }
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const FilterEmployeesController = async(req: Request, res: Response) => {
    // #swagger.tags = ['Employees Management']
    console.log("\n\t FilterEmployeesController-req.body: ", req.body)
    const input = req.body.input;
    let filter = [] as any[];
    const users = await Employees.find();
    const reqUsers = await userMgtHelper(users);
    const keys = [
        "firstname",
        "lastname",
        "username",
        "id"
    ]
    for(let user of reqUsers){
        keys.forEach(key => {
            const val = user[key];
            if(String(val).toLowerCase().includes(input.toLowerCase())){
                // const logs = await UserLog.find({stringDate});
                console.log("\n\t FilterEmployeesController-user: ", user)
                !filter.includes(user) && filter.push(user);
            };
        })
    };
    return res.status(200).json({
        data: filter,
        status: true
    })
};

export default AllEmployeesController;

