import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from './dbOperations';

export class admin extends dbOperations {
    private readonly adminID: string
    private readonly accountID: string
    private readonly TABLE: string = "Admin"

    constructor(
        adminID: string | undefined,
        accountID: string
    ) {
        super()
        this.adminID = adminID === undefined ? uuidv4() : adminID
        this.accountID = accountID

        this.assignData({
            adminID: this.adminID,
            accountID: this.accountID,
            TABLE: this.TABLE
        })
    }
}