export class account {
    private readonly accountID: number
    private firstname: string
    private lastname: string
    private email: string
    private password: string
    private role: string

    constructor(
        accountID: number,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: string
    ) {

        this.accountID = accountID
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
        this.role = role
    }
}