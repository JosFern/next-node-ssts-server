interface account {
    accountID: string | undefined
    firstname: string
    lastname: string
    email: string
    role: string
    password: string
}

export const accounts: account[] = [
    {
        accountID: undefined,
        firstname: "Marie",
        lastname: "Bulosan",
        email: "marie@gmail.com",
        role: "employer",
        password: "marie123",
    },
    {
        accountID: undefined,
        firstname: "Ayato",
        lastname: "Kamisato",
        email: "ayato@gmail.com",
        role: "admin",
        password: "ayato123",
    },
    {
        accountID: undefined,
        firstname: "John",
        lastname: "Doe",
        email: "john@gmail.com",
        role: "employer",
        password: "john123",
    },
    {
        accountID: undefined,
        firstname: "Ayaka",
        lastname: "Kamisato",
        email: "ayaka@gmail.com",
        role: "employee",
        password: "ayaka123",
    },
]