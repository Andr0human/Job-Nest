import mongoose from 'mongoose';
import IUser from '../entities/IUser';
import userSchema from './schema';

const userModel: mongoose.Model<IUser> = mongoose.model<IUser>(
    'User',
    userSchema,
);

export default userModel;
