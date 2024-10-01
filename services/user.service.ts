// user.service.ts
import { IUserDocument } from "../models/user.model";
import { IUserRepository } from "../repository/user.repository";

export interface IUserService {
    findAll(): Promise<IUserDocument[]>;
    findOneById(id: string): Promise<IUserDocument | null>;
    findOneByEmail(email: string): Promise<IUserDocument | null>;
}

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

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
