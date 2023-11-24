import { OriginSubmission, SubmissionStatus } from "../../enums";
import { DataSourceDTOInterface } from "./DataSourceDTOInterface";
import { AuthorDTOInterface } from "./AuthorDTOInterface";

export interface SubmissionDTOInterface {
    id: number;
    study: string;
    analysis: string;
    origin: OriginSubmission;
    dataSource: DataSourceDTOInterface;
    status: SubmissionStatus;
    author: AuthorDTOInterface;
    submitted: string;
    finished: string;
    environment: string;
}