import dotenv from "dotenv";

import server from "./server";
import dbConnect from "./config/dbConnect";

dotenv.config({path: process.env.ENV_PATH as string});


//spin up the server on the env port number
const PORT = process.env.PORT;



server.listen(PORT, async() => {
    await dbConnect();
    // console.log("\n\t hotelDate: ", hotelDate)
    console.log(`\n\t Server started on port: ${PORT}`);
});
