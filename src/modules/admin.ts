import { v4 as uuidv4 } from 'uuid';
import { account } from './account';

export class admin extends account {
    public readonly adminID: string

    constructor(
        accountID: string | undefined,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: "admin",
        adminID: string | undefined
    ) {
        super(accountID, firstname, lastname, email, password, role)
        this.adminID = adminID === undefined ? uuidv4() : adminID
    }
}