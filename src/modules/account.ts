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

    // updateAccount = (acc: object | any) => {

    //     const { firstname, lastname, email, password } = acc
    //     this.firstname = firstname
    //     this.lastname = lastname
    //     this.email = email
    //     this.password = password
    // }
    // insertAccount = async () => {
    //     const accountStringFormat = "{ 'accountID': ?, 'email': ?, 'firstname': ?, 'lastname': ?, 'password': ?, 'role': ?}"
    //     const accountParams = [
    //         { S: this.accountID },
    //         { S: this.getEmail() },
    //         { S: this.getFirstName() },
    //         { S: this.getLastName() },
    //         { S: this.getPassword() },
    //         { S: this.role },
    //     ]

    //     await insertDB("Account", accountStringFormat, accountParams)
    // }

    // updateAccount = (origEmail: string) => {

    //     if (this.email !== origEmail) {
    //         deleteDB("Account", this.accountID, "accountID", "email", origEmail)

    //         const newAccount = new account(this.accountID, this.firstname, this.lastname, this.email, this.password, "employee")

    //         newAccount.insertAccount()
    //     } else {
    //         const stringFormat = ` firstname='${this.firstname}', lastname='${this.lastname}', password='${this.password}' `

    //         updateDB('Account', stringFormat, this.accountID, "accountID", "email", origEmail)
    //     }
    // }
}