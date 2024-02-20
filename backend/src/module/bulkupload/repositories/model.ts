import mongoose from 'mongoose';
import IBulkUpload from '../entities/IBulkUpload';
import bulkUploadSchema from './schema';

const bulkUploadModel: mongoose.Model<IBulkUpload> = mongoose.model<IBulkUpload>('bulk_upload', bulkUploadSchema);

export default bulkUploadModel;
