import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from './dbOperations';

export class employer extends dbOperations {
    public readonly employerID: string;
    public readonly accountID: string
    public companyID: string;
    private readonly TABLE = 'Employer'

    constructor(
        employerID: string | undefined,
        accountID: string,
        companyID: string
    ) {
        super()
        this.employerID = employerID === undefined ? uuidv4() : employerID
        this.accountID = accountID
        this.companyID = companyID

        this.assignData({
            employerID: this.employerID,
            accountID: this.accountID,
            companyID: this.companyID,
            TABLE: this.TABLE
        })
    }
}