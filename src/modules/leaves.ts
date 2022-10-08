export class leave {
    public readonly datestart: string
    public readonly dateend: string
    public readonly reason: string
    private approved: boolean

    constructor(datestart: string, dateend: string, reason: string, approved: boolean) {
        this.datestart = datestart
        this.dateend = dateend
        this.reason = reason
        this.approved = approved
    }
}