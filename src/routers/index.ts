import { Router } from "express";
import swaggerFile from "./swagger-docs";
import SwaggerUI from "swagger-ui-express";

import employeeRouters from "../employees/routes";
import jobRolesRouters from "../jobRoles/routes";
import usersRouter from "../users/routes";
const appRouter = Router()
appRouter.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerFile));


appRouter.use('/employees', employeeRouters);
appRouter.use('/roles', jobRolesRouters);
appRouter.use('/users', usersRouter);

export default appRouter;