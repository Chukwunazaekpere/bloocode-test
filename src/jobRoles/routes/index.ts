import {Router} from "express";
const roleManagementRouter = Router();

import { authenticate, isLoggedIn } from "../../utilities/authService";
import roleManagementControllers from "../controllers";

roleManagementRouter.use(authenticate);
roleManagementRouter.use(isLoggedIn);

// roleManagementRouter.get("/get-role-by-id/:id",  roleManagementControllers.ge);
// roleManagementRouter.post("/search",  roleManagementControllers.f);
roleManagementRouter.get("/get-role/:start/:end",  roleManagementControllers.AllRolesController);

roleManagementRouter.put("/update-role-status/:roleId",  roleManagementControllers.UpdateRolesController);


roleManagementRouter.delete("/delete/:id",  roleManagementControllers.DeleteRolesController);



export default roleManagementRouter;
