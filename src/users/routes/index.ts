import {Router} from "express";
const usersRouter = Router();

import { authenticate, authorize, isLoggedIn } from "../../utilities/authService";
import usersControllers from "../../users/controllers";

const  {
    CreateUserController,
    DeleteUserController,
    LoginController,
    UserLogsController
} = usersControllers;

// usersRouter.get("/", authenticate, getAllUser);

console.log("\n\t User.API...")
usersRouter.post("/signup", isLoggedIn, authenticate, CreateUserController);

usersRouter.post("/login", LoginController);
usersRouter.get("/logs", UserLogsController);



usersRouter.delete("/delete/:id", authenticate, isLoggedIn, authorize(["Super Admin", "Developer"]), DeleteUserController);

export default usersRouter;


