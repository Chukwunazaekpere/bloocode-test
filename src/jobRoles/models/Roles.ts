import mongoose, {Model, ObjectId, Schema} from "mongoose";
import dotenv from "dotenv";
import { randomIdGenerator } from "../../utilities/userActivities";


interface RolesSchemaInterface {
    roleName: string
    roleDescription: string
}



interface RolesMethods extends Model<RolesSchemaInterface> {
    computeRoleId: () => Promise<string | undefined>
 
};

const RolesSchema = new mongoose.Schema<RolesSchemaInterface>({
    roleName: {
        type: String,
        required: true,
    },
    roleDescription: {
        type: String,
        required: true,
    },
});


RolesSchema.statics.computeRolesId = async function(): Promise<string | undefined> { 
    try {
        const roleDocs = await this.find();
        const roleDocsId =randomIdGenerator(20, 25)
        return roleDocsId;
    } catch (error: any) {
        return undefined
    }
}

RolesSchema.statics.getRolesId = async function(id: string): Promise<string | undefined> { 
    try {
        const RolesId = await this.findById(id);
        return RolesId.roleId;
    } catch (error) {
        return undefined
    }
}

const Roles = mongoose.model<RolesSchemaInterface, RolesMethods>("Roles", RolesSchema);
export default Roles;