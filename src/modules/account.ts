
export class account {
    public readonly accountID: string
    private firstname: string
    private lastname: string
    private email: string
    private password: string
    private role: string

    constructor(
        accountID: string,
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


    updateAccount = (acc: object | any) => {

        const { firstname, lastname, email, password } = acc

        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
    }
}