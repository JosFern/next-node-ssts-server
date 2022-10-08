import { v4 as uuidv4 } from 'uuid';

export class employer {
    public readonly employerID: string;
    public readonly accountID: string;
    public companyID: string;

    constructor(employerID: string, accountID: string, companyID: string) {
        this.employerID = employerID === undefined ? uuidv4() : employerID
        this.accountID = accountID
        this.companyID = companyID
    }

    updateCompany = (companyID: string) => {
        this.companyID = companyID
    }
}