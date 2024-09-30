import { connect } from "mongoose";
import config from "./config";
export const getConnection = async () => {
    try {
        await connect(config.mongodb as string);
        console.log("Connected to mongodb")
    } catch (error) {
        console.log("Can not connect to mongodb: ", error)
    }
}