import mongoose from 'mongoose';
import IUser from '../entities/IUser';

const userSchema: mongoose.Schema<IUser> = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        dateOfBirth: { type: String },
        gender: { type: String },
        phoneNumber: { type: String },

        summary: { type: String },
        skills: { type: [String] },
        domains: { type: [String] },
        achievements: { type: [String] },
        resume: { type: Buffer },
    },
    { timestamps: true },
);

export default userSchema;
