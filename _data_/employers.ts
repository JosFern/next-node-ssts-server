interface employer {
    accountID: string | undefined
    firstname: string
    lastname: string
    email: string
    role: "employer"
    password: string
    company: string | undefined
}

export const employers: employer[] = [
    {
        accountID: undefined,
        firstname: "Marie",
        lastname: "Bulosan",
        email: "marie@gmail.com",
        role: "employer",
        password: "123123123",
        company: undefined,
    },
    {
        accountID: undefined,
        firstname: "Ayato",
        lastname: "Kamisato",
        email: "ayato@gmail.com",
        role: "employer",
        password: "123123123",
        company: undefined,
    },
    {
        accountID: undefined,
        firstname: "John",
        lastname: "Doe",
        email: "john@gmail.com",
        role: "employer",
        password: "123123123",
        company: undefined,
    },
    {
        accountID: undefined,
        firstname: "Ayaka",
        lastname: "Kamisato",
        email: "ayaka@gmail.com",
        role: "employer",
        password: "123123123",
        company: undefined,
    },
]