import { BaseRepository } from '../../../lib/base';
import IJobListing from '../entities/IJobListing';
import jobListingModel from './model';

class JobRepository extends BaseRepository<IJobListing> {
    constructor() {
        super(jobListingModel);
    }

    seed = async (job: IJobListing): Promise<void> => {
        const existingJob: IJobListing | null = await this.model.findOne({
            title: job.title,
            company: job.company,
        });

        if (!existingJob) {
            await this.createOne(job);
        }
    };

    update = async (
        id: string,
        newData: IJobListing,
    ): Promise<IJobListing | null> => {
        const result: IJobListing | null = await this.model.findByIdAndUpdate(
            id,
            { $set: newData },
            { new: true },
        );
        return result;
    };

    getAll = async (
        filters: any,
        sortBy: string,
        fields: string,
        page: number,
        limit: number,
    ): Promise<IJobListing[]> => {
        const skip: number = (page - 1) * limit;
        const result: IJobListing[] = await this.model
            .find(filters)
            .sort(sortBy)
            .select(fields)
            .skip(skip)
            .limit(limit);
        return result;
    };
}

export default JobRepository;
