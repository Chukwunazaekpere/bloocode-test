import { Request, Response } from "express";
import usersModels from "../models";
// import { userRoles } from "../models/Users";
const { Users } = usersModels;

export const userMgtHelper = async(requiredUsers: any[]) => {
    const actualData = [] as any[];
    const utils = {}as any;
    for(let user of requiredUsers){
        const { createdBy, _doc } = user as any;
        // const userDetails = await Users.findById(createdBy);
        let userDetails: string | undefined = utils[String(createdBy)];
        if(!userDetails){
            const user = await Users.findById(createdBy);
            userDetails = user ? user.firstname.concat(" ", user.lastname) : "--";
            utils[String(createdBy)] = userDetails;
        };
        const data = {
            ..._doc as any,
            createdBy: userDetails
        };
        actualData.push(data);
    };
    return actualData
}
const AllUsersController = async(req: Request, res: Response) => {
    // console.log("\n\t AllUsersController...", req.body)
    // #swagger.tags = ['Users Management']
    try {
        const users = await Users.find();
        const { paginationStartPoint, paginationEndPoint} = req.params;
        const noRecord = "No users currently"
        return res.status(200).json({
            status: "Success",
            data: {
                data: users,
                serverRecordLength: users.length
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




export default AllUsersController;