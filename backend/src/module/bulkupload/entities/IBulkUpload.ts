import { IBase } from '../../../lib/base';
import IErrorDetail from './IErrorDetail';

interface IBulkUpload extends IBase {
  status: string;
  endedAt?: Date;
  time: number;
  filename: string;
  successfulEntries: number;
  failedEntries: number;
  entriesCompleted: number;
  totalEntries: number;
  errorDetails?: IErrorDetail[];
}

export default IBulkUpload;
