import { deleteDB, insertDB, updateDB } from '../lib/database/query';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from './dbOperations';

export class account extends dbOperations {
    public readonly accountID: string
    private firstname: string
    private lastname: string
    private email: string
    private password: string
    public readonly role: string
    private readonly TABLE = "Account"

    constructor(
        accountID: string | undefined,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: string
    ) {
        super()
        this.accountID = accountID === undefined ? uuidv4() : accountID
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
        this.role = role

        this.assignData({
            accountID: this.accountID,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            role: this.role,
            TABLE: this.TABLE
        })
    }

    getFirstName = () => this.firstname

    getLastName = () => this.lastname

    getEmail = () => this.email

    getPassword = () => this.password
}