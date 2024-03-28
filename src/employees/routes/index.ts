import {Router} from "express";
const employeeManagementRouter = Router();

import { authenticate, isLoggedIn } from "../../utilities/authService";
import employeeManagementControllers from "../controllers";

employeeManagementRouter.use(authenticate);
employeeManagementRouter.use(isLoggedIn);

employeeManagementRouter.get("/get-employee-by-id/:id",  employeeManagementControllers.GetEmployeeByIdController);
employeeManagementRouter.post("/search",  employeeManagementControllers.FilterEmployeesController);
employeeManagementRouter.get("/get-employee/:start/:end",  employeeManagementControllers.AllEmployeesController);

employeeManagementRouter.put("/update-employee-status/:employeeId",  employeeManagementControllers.UpdateEmployeesController);


employeeManagementRouter.delete("/delete/:id",  employeeManagementControllers.DeleteEmployeesController);



export default employeeManagementRouter;
