import userModel, { IUser } from "../../models/user.model";
import { ApiError } from "../utils/error";

export const getUsers =async () => {
    return await userModel.find({deleted: false})
}

export const getUserById = async (id: string) =>{
    return userModel.findOne({_id: id, deleted: false})
}

export const createUser = async (userBody: IUser) => {
    return userModel.create(userBody)
}

export const updateUserById = async (id: string, userBody: Partial<IUser>) => {
    const user = await getUserById(id);
    if(!user){
        throw new ApiError(404,"User is not found")
    }
    Object.assign(user, userBody)
    await user.save()
    return user 
}

export const deleteUser = async (id: string): Promise<void> => {
    await updateUserById(id, {deleted: true})
}