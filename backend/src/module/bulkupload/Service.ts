import IBulkUpload from './entities/IBulkUpload';
import IErrorDetail from './entities/IErrorDetail';
import BulkUploadRepository from './repositories/Repository';

class BulkUploadService {
    bulkUploadRepository: BulkUploadRepository;

    constructor() {
        this.bulkUploadRepository = new BulkUploadRepository();
    }

    countDocuments = async (): Promise<number> => {
        const result: number = await this.bulkUploadRepository.countDocuments({});
        return result;
    };

    getAll = async (
        queryObj: any,
        page: number,
        limit: number,
    ): Promise<IBulkUpload[] | null> => {
        // SORT
        const sortBy: string = queryObj.sort
            ? (queryObj.sort as string).split(',').join(' ')
            : '-createdAt';

        // FIELD LIMITING
        const fields: string = queryObj.fields
            ? (queryObj.fields as string).split(',').join(' ')
            : '-__v';

        const result: IBulkUpload[] | null = await this.bulkUploadRepository.getAll(
            sortBy,
            fields,
            page,
            limit,
        );
        return result;
    };

    getById = async (
        uploadId: string,
        fields: string,
    ): Promise<IBulkUpload | null> => {
        const result: IBulkUpload | null = await this.bulkUploadRepository.getById(
            uploadId,
            fields,
        );
        return result;
    };

    updateById = async (
        uploadId: string,
        newData: IBulkUpload,
        errorDetails: IErrorDetail[],
    ): Promise<void> => {
        const updatedRecord: IBulkUpload = newData.status === 'completed'
            ? { ...newData, endedAt: new Date() }
            : newData;

        await this.bulkUploadRepository.updateRecord(uploadId, updatedRecord);

        await this.bulkUploadRepository.updateErrorList(uploadId, errorDetails);
    };

    create = async (uploadData: IBulkUpload): Promise<IBulkUpload> => {
        const result: IBulkUpload = await this.bulkUploadRepository.createOne(uploadData);
        return result;
    };

    generateHollowEntry = async (filename: string, totalEntries: number): Promise<IBulkUpload> => {
        const hollowData: IBulkUpload = {
            status: 'running',
            time: 0,
            filename,
            successfulEntries: 0,
            failedEntries: 0,
            entriesCompleted: 0,
            totalEntries,
            errorDetails: [],
        };

        const result: IBulkUpload = await this.create(hollowData);
        return result;
    };

    deleteAll = async (): Promise<void> => {
        await this.bulkUploadRepository.deleteAll();
    };
}

export default BulkUploadService;
