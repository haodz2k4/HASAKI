// user.service.ts
import { IUser, IUserDocument } from "../models/user.model";
import { IUserRepository } from "../repository/user.repository";

export interface IUserService {
    findAll(): Promise<IUserDocument[]>;
    findOneById(id: string): Promise<IUserDocument | null>;
    findOneByEmail(email: string): Promise<IUserDocument | null>;
    create(bodyUser: IUser): Promise<IUserDocument>;
}

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}
    async create(bodyUser: IUser): Promise<IUserDocument> {
        return await this.userRepository.create(bodyUser)
    }

    findAll(): Promise<IUserDocument[]> {
        throw new Error("Method not implemented.");
    }

    findOneById(id: string): Promise<IUserDocument | null> {
        throw new Error("Method not implemented.");
    }

    async findOneByEmail(email: string): Promise<IUserDocument | null> {
        return await this.userRepository.findOneByEmail(email);
    }
}
