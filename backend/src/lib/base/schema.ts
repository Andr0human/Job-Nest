import mongoose from 'mongoose';
import type IBase from './interface';

const baseSchema: mongoose.Schema<IBase> = new mongoose.Schema<IBase>({
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

export default baseSchema;
