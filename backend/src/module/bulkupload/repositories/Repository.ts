import { Types } from 'mongoose';
import { BaseRepository } from '../../../lib/base';
import IBulkUpload from '../entities/IBulkUpload';
import IErrorDetail from '../entities/IErrorDetail';
import bulkUploadModel from './model';

class BulkUploadRepository extends BaseRepository<IBulkUpload> {
    constructor() {
        super(bulkUploadModel);
    }

    getAll = async (
        sortBy: string,
        fields: string,
        page: number,
        limit: number,
    ): Promise<IBulkUpload[] | null> => {
        const skip: number = (page - 1) * limit;
        const result: IBulkUpload[] | null = await this.model
            .find()
            .sort(sortBy)
            .select(fields)
            .skip(skip)
            .limit(limit);
        return result;
    };

    updateRecord = async (id: string, newData: IBulkUpload): Promise<IBulkUpload | null> => {
        const result: IBulkUpload | null = await this.model.findByIdAndUpdate(
            id,
            { $set: newData },
            { new: true },
        );
        return result;
    };

    updateErrorList = async (recordId: string, errorList: IErrorDetail[]): Promise<void> => {
        const bulkOps = errorList.map((errorDetail: IErrorDetail) => ({
            updateOne: {
                filter: { _id: new Types.ObjectId(recordId) },
                update: { $push: { errorDetails: errorDetail } },
            },
        }));

        await this.model.bulkWrite(bulkOps, {
            ordered: false,
        });
    };
}

export default BulkUploadRepository;
