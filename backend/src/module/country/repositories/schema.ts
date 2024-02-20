import mongoose from 'mongoose';
import type ICountry from '../entities/ICountry';

const countrySchema: mongoose.Schema<ICountry> = new mongoose.Schema<ICountry>(
    {
        name: { type: String, required: true, unique: true },
        code: { type: String, required: true, unique: true },
        continent: { type: String, required: true },
        capital: { type: String, required: true },
        population: { type: Number, required: true },
        language: { type: String, required: true },
    },
    { timestamps: true },
);

export default countrySchema;
