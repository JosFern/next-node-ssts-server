interface admin {
    accountID: string | undefined
    firstname: string
    lastname: string
    email: string
    role: "admin"
    password: string
    adminID: string | undefined
}

export const admins: admin[] = [
    {
        accountID: undefined,
        firstname: "Marie",
        lastname: "Bulosan",
        email: "marie@gmail.com",
        role: "admin",
        password: "123123123",
        adminID: undefined,
    },
    {
        accountID: undefined,
        firstname: "Ayato",
        lastname: "Kamisato",
        email: "ayato@gmail.com",
        role: "admin",
        password: "123123123",
        adminID: undefined,
    },
    {
        accountID: undefined,
        firstname: "John",
        lastname: "Doe",
        email: "john@gmail.com",
        role: "admin",
        password: "123123123",
        adminID: undefined,
    },
    {
        accountID: undefined,
        firstname: "Ayaka",
        lastname: "Kamisato",
        email: "ayaka@gmail.com",
        role: "admin",
        password: "123123123",
        adminID: undefined,
    },
]