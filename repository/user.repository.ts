import userModel, { IUserDocument, IUser } from "../models/user.model";
import UserModel from "../models/user.model";
export interface IUserRepository{
    findAll(): Promise<IUserDocument[]>;
    findOneById(id: string): Promise<IUserDocument | null>;
    findOneByEmail(email: string): Promise<IUserDocument | null>;
    create(bodyUser: IUser): Promise<IUserDocument>;
}

export class UserRepository implements IUserRepository {
    async create(bodyUser: IUser): Promise<IUserDocument> {
        return await UserModel.create(bodyUser)
    }
    findAll(): Promise<IUserDocument[]>{
        throw new Error("Method not implemented.");
    }
    findOneById(id: string): Promise<IUserDocument | null> {
        throw new Error("Method not implemented.");
    }
    async findOneByEmail(email: string): Promise<IUserDocument | null> {
        return await userModel.findOne({email}).select("+password")
    }
    
    
}
