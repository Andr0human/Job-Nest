import { BaseRepository } from '../../../lib/base';
import IUser from '../entities/IUser';
import userModel from './model';

class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(userModel);
    }

    seed = async (user: IUser): Promise<void> => {
        const existingUser: IUser | null = await this.getByEmail(user.email);

        if (!existingUser) {
            await this.createOne(user);
        }
    };

    getAll = async (): Promise<IUser[] | null> => {
        const result: IUser[] | null = await this.findAll();
        return result;
    };

    getByEmail = async (email: string): Promise<IUser | null> => {
        const result: IUser | null = await this.model.findOne({ email });
        return result;
    };

    create = async (user: IUser): Promise<IUser> => {
        const result: IUser = await this.createOne(user);
        return result;
    };

    update = async (
        id: string,
        newData: IUser,
    ): Promise<IUser | null> => {
        const result: IUser | null = await this.model.findByIdAndUpdate(
            id,
            { $set: newData },
            { new: true },
        );
        return result;
    };
}

export default UserRepository;
