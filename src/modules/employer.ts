import { find } from 'lodash';
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

    updateEmployerCompany = (companyID: string) => {
        this.companyID = companyID
    }
}