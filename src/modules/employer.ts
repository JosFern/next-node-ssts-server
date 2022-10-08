export class employer {
    public readonly id: number;
    public readonly accountID: number;
    public readonly companyID: number;

    constructor(id: number, accountID: number, companyID: number) {
        this.id = id
        this.accountID = accountID
        this.companyID = companyID
    }
}