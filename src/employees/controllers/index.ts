import CreateEmployeesController from "./CreateEmployeesController";
import DeleteEmployeesController from "./DeleteEmployeesController";

import UpdateEmployeesController from "./UpdateEmployeesController";
import AllEmployeesController from "./AllEmployeesController";
import { GetEmployeeByIdController, FilterEmployeesController } from "./AllEmployeesController";

const usersControllers = {
    CreateEmployeesController,
    DeleteEmployeesController,
    GetEmployeeByIdController,
    UpdateEmployeesController,
    AllEmployeesController,
    FilterEmployeesController
}

export default usersControllers;