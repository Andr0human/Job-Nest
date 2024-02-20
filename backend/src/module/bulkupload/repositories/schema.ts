import mongoose from 'mongoose';
import IBulkUpload from '../entities/IBulkUpload';
import IErrorDetail from '../entities/IErrorDetail';

const errorDetailSchema: mongoose.Schema<IErrorDetail> = new mongoose.Schema<IErrorDetail>(
    {
        message: { type: String, required: true },
        rowNumber: { type: Number, required: true },
    },
    { _id: false }, // Disable _id for embedded subdocuments
);

const bulkUploadSchema: mongoose.Schema<IBulkUpload> = new mongoose.Schema<IBulkUpload>(
    {
        status: { type: String, required: true },
        endedAt: { type: Date },
        time: { type: Number },
        filename: { type: String, required: true },
        successfulEntries: { type: Number, required: true },
        failedEntries: { type: Number, required: true },
        entriesCompleted: { type: Number, required: true },
        totalEntries: { type: Number },
        errorDetails: { type: [errorDetailSchema], default: [] },
    },
    { timestamps: true },
);

export default bulkUploadSchema;
