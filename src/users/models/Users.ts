import mongoose, {Model, ObjectId, Schema} from "mongoose";
import { randomIdGenerator } from "../../utilities/userActivities";
// dotenv.config({path: "./src/config/.env"})


export interface UsersSchemaInterface {
    firstname: string
    lastname: string
    userId: string
    email: string
    username: string
    password: string
    usersRole: string
    userType: string
    phone: string
    lastSeen: Date
    createdBy: ObjectId
    updatedBy: ObjectId
    dateCreated: Date,
    dateUpdated: Date
}

export enum UserRolesEnum {
    "DEV" = "Developer",
    "ADM" = "Admin",
    "MGR" = "Manager",
    "DSN" = "Design",
    "SCM" = "Scrum Master"
}

export enum UserTypeEnum {
    "EMP" = "Employee",
    "INT" = "Internal",
}

interface UsersMethods extends Model<UsersSchemaInterface> {
    computeUsersId: () => Promise<string | undefined>
    getUsersId: (id: string) => Promise<string | undefined>
};

const UserSchema = new mongoose.Schema<UsersSchemaInterface>({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },

    userId: {
        type: String,
        index: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    usersRole: {
        type: String,
        required: true,
        enum: UserRolesEnum,
        default: UserRolesEnum.SCM
    },
    userType: {
        type: String,
        required: true,
        enum: UserTypeEnum,
        default: UserTypeEnum.EMP
    },
    phone: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    lastSeen: {
        type: Date,
        required: false,
    },
    dateUpdated: {
        type: Date,
        required: true
    }
});


UserSchema.statics.computeUsersId = async function(): Promise<string | undefined> { 
    try {
        const userDocs = await this.find();
        const userDocsId =randomIdGenerator(20, 25)
        return userDocsId;
    } catch (error: any) {
        return undefined
    }
}

UserSchema.statics.getUsersId = async function(id: string): Promise<string | undefined> { 
    try {
        const usersId = await this.findById(id);
        return usersId.userId;
    } catch (error) {
        return undefined
    }
}

const User = mongoose.model<UsersSchemaInterface, UsersMethods>("User", UserSchema);
export default User;