import { find } from 'lodash';
import { insertDB, updateDB } from '../lib/database/query';
import { v4 as uuidv4 } from 'uuid';
import { account } from './account';
import { company } from './company';
import { store } from './store';

export class employer extends account {
    public readonly employerID: string;
    public companyID: string;

    constructor(
        accountID: string | undefined,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: string,
        employerID: string | undefined,
        companyID: string
    ) {
        super(accountID, firstname, lastname, email, password, role)
        this.employerID = employerID === undefined ? uuidv4() : employerID
        this.companyID = companyID
    }

    getAssocCompany = (): company | any => find(store.getCompanies(), (comp) => comp.id === this.companyID)

    // updateEmployerCompany = (companyID: string) => {
    //     this.companyID = companyID
    // }

    insertEmployer = async () => {
        const employerStringFormat = "{ 'accountID': ?, 'employerID': ?, 'companyID': ? }"
        const employerParams = [
            { S: this.accountID },
            { S: this.employerID },
            { S: this.companyID },
        ]

        const accountStringFormat = "{ 'accountID': ?, 'email': ?, 'firstname': ?, 'lastname': ?, 'password': ?, 'role': ?}"
        const accountParams = [
            { S: this.accountID },
            { S: this.getEmail() },
            { S: this.getFirstName() },
            { S: this.getLastName() },
            { S: this.getPassword() },
            { S: this.role },
        ]

        try {
            await insertDB("Employer", employerStringFormat, employerParams)
            await insertDB("Account", accountStringFormat, accountParams)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }

    updateEmployerCompany = async () => {

        const stringFormat = ` companyID='${this.companyID}' `

        updateDB('Employer', stringFormat, this.employerID, "employerID", "accountID", this.accountID)
    }
}