import mongoose from 'mongoose';
import type ICountry from '../entities/ICountry';
import countrySchema from './schema';

const countryModel: mongoose.Model<ICountry> = mongoose.model<ICountry>(
    'Country',
    countrySchema,
);

export default countryModel;
