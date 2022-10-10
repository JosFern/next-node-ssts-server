import { v4 as uuidv4 } from 'uuid';

export class account {
    public readonly accountID: string
    private firstname: string
    private lastname: string
    private email: string
    private password: string
    public readonly role: string

    constructor(
        accountID: string | undefined,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: string
    ) {
        this.accountID = accountID === undefined ? uuidv4() : accountID
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
        this.role = role
    }

    getFirstName = () => this.firstname

    getLastName = () => this.lastname

    getEmail = () => this.email

    getPassword = () => this.password

    updateAccount = (acc: object | any) => {

        const { firstname, lastname, email, password } = acc
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
    }
}