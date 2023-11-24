export interface UserDTOSearchInterface {
    id: string;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    username: string;
    roles: string[];
    enabled: boolean;
}