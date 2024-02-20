import mongoose from 'mongoose';
import IJobListing from '../entities/IJobListing';
import jobListingSchema from './schema';

const jobListingModel: mongoose.Model<IJobListing> = mongoose.model<IJobListing>('job_listing', jobListingSchema);

export default jobListingModel;
