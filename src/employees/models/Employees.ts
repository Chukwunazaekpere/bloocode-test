import mongoose, {Model, ObjectId, Schema} from "mongoose";
import dotenv from "dotenv";
import { UsersSchemaInterface } from "../../users/models/Users";
import { randomIdGenerator } from "../../utilities/userActivities";

interface EmployeesSchemaInterface extends UsersSchemaInterface {
   status: string
}



export enum EmployeesStatusEnum {
    "EMPLD" = "Employed",
    "FRD" = "Fired",
}

interface EmployeesMethods extends Model<EmployeesSchemaInterface> {
    computeEmployeesId: () => Promise<string | undefined>
    getemployeesId: (id: string) => Promise<string | undefined>
};

const EmployeesSchema = new mongoose.Schema<EmployeesSchemaInterface>({
    status: {
        type: String,
        required: true,
        enum: EmployeesStatusEnum
    },

});


EmployeesSchema.statics.computeemployeesId = async function(): Promise<string | undefined> { 
    try {
        const employeeDocs = await this.find();
        const employeeDocsId =randomIdGenerator(20, 25)
        return employeeDocsId;
    } catch (error: any) {
        return undefined
    }
}

EmployeesSchema.statics.getemployeesId = async function(id: string): Promise<string | undefined> { 
    try {
        const employeesId = await this.findById(id);
        return employeesId.employeeId;
    } catch (error) {
        return undefined
    }
}

const Employees = mongoose.model<EmployeesSchemaInterface, EmployeesMethods>("Employees", EmployeesSchema);
export default Employees;