import { Request, Response } from "express"
import usersModels from "../models";
import { todaysDate } from "date-fran";
const { UserLogs } = usersModels;


const UserLogsController = async (req: Request, res: Response) => {
      // #swagger.tags = ['Users Management']
    try{
        // console.log("\n\t user-activities/user-logs...")
        const originalUrl = req.originalUrl;
        let userLogs = []as any[]; 

        if(originalUrl.includes('reports')){
            userLogs = await UserLogs.find({stringDate: todaysDate().toDateString()}).sort({dateCreated: -1}).select("-ipAddress").select("-systemName").select("-_id")
        }else{
            userLogs = await UserLogs.find().sort({
                dateCreated: -1
            }).select("-ipAddress").select("-systemName").select("-_id")
        };
        return res.status(200).json({
            data: userLogs,
            message: "Success",
            status: true
        });
    }catch(error){
        console.log("\n\t UserLogsController-error: ", error)
        return res.status(500).json({
            message: "Network error",
            status: "Error"
        });
    }
}

export default UserLogsController;