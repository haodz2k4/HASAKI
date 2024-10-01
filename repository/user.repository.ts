import userModel, { IUserDocument } from "../models/user.model";
import UserModel from "../models/user.model";
export interface IUserRepository{
    findAll(): Promise<IUserDocument[]>;
    findOneById(id: string): Promise<IUserDocument | null>;
    findOneByEmail(email: string): Promise<IUserDocument | null>;

}

export class UserRepository implements IUserRepository {
    findAll(): Promise<IUserDocument[]>{
        throw new Error("Method not implemented.");
    }
    findOneById(id: string): Promise<IUserDocument | null> {
        throw new Error("Method not implemented.");
    }
    async findOneByEmail(email: string): Promise<IUserDocument | null> {
        return await userModel.findOne({email})
    }
    
}
