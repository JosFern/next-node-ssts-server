export class overtime {
    public readonly datehappen: string
    public readonly timestart: string
    public readonly timeend: string
    public readonly reason: string
    private approved: boolean

    constructor(datehappen: string, timestart: string, timeend: string, reason: string, approved: boolean) {
        this.datehappen = datehappen
        this.timestart = timestart
        this.timeend = timeend
        this.reason = reason
        this.approved = approved
    }
}