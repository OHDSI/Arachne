import { DBMSType } from "../../enums";

export interface DataSourceDTOInterface {
    id?: number;
    uuid: string;
    name: string;
    description: string;
    dbmsType: DBMSType;
    connectionString: string;
    cdmSchema: string;
    dbUsername: string;
    dbPassword: string;
    modelType: string;
    healthStatus: string;
    healthStatusDescription?: string;
    targetSchema: string;
    resultSchema: string;
    published: boolean;
    useKerberos: boolean;
    krbRealm: any;
    krbFQDN: any;
    krbUser: any;
    krbPassword?: any;
    hasKeytab?: boolean;
    krbAuthMechanism: string;
    cohortTargetTable: string;
}