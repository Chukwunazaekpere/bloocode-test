// import sq, { Model } from "sequelize"
import mongoose, { Model } from "mongoose";
import { randomIdGenerator } from "../../utilities/userActivities";

interface UserLogInterface {
    userFullname: string
    logId: string
    stringDate: string
    usersRole: string
    operation: string
    dateCreated: Date
    monthRecord: number
    yearRecord: number
}

interface UsersLogMethods extends Model<UserLogInterface> {
    computeUsersLogId: () => Promise<string | undefined>
    getUsersLogId: (id: string) => Promise<string | undefined>
};

const UserLogSchema = new mongoose.Schema<UserLogInterface>({
    userFullname: {
        type: String,
        index: true,
    },
    logId: {
        type: String,
        index: true,
    },
    stringDate: {
        type: String,
        required: true,
        // unique: true
    },
    monthRecord: {
        type: Number,
        required: true,
        // unique: true
    },
    yearRecord: {
        type: Number,
        required: true,
        // unique: true
    },
    usersRole: {
        type: String,
    },
    operation: {
        type: String,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
});


UserLogSchema.statics.computeUsersLogId = async function(): Promise<string | undefined> { 
    try {
        // const userDocs = await this.find();
        const userDocsId = await randomIdGenerator(5, 10);
        return userDocsId;
    } catch (error: any) {
        return undefined
    }
}

UserLogSchema.statics.getUsersLogId = async function(id: string): Promise<string | undefined> { 
    try {
        const usersLogId = await this.findById(id);
        return usersLogId.logId;
    } catch (error) {
        return undefined
    }
}


const UserLog = mongoose.model<UserLogInterface, UsersLogMethods>("UserLog", UserLogSchema);
export default UserLog;