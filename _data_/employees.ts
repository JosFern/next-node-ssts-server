
interface employee {
    accountID: string | undefined
    firstname: string
    lastname: string
    email: string
    password: string
    role: "employee"
    employeeID: string | undefined
    salaryperhour: number
    employmenttype: "parttime" | "fulltime"
    position: string
    company: string | undefined
}

export const employees: employee[] = [
    {
        accountID: undefined,
        firstname: "Rex",
        lastname: "Lapis",
        email: "morax@gmail.com",
        password: "morax123",
        role: "employee",
        employeeID: undefined,
        salaryperhour: 10,
        employmenttype: "fulltime",
        position: "Geo Archon",
        company: undefined
    },
    {
        accountID: undefined,
        firstname: "Xiao",
        lastname: "Alatus",
        email: "xiao@gmail.com",
        password: "xiao123",
        role: "employee",
        employeeID: undefined,
        salaryperhour: 8,
        employmenttype: "fulltime",
        position: "Vigilant Yaksha",
        company: undefined
    },
    {
        accountID: undefined,
        firstname: "Amber",
        lastname: "Teigrov",
        email: "amber@gmail.com",
        password: "amber123",
        role: "employee",
        employeeID: undefined,
        salaryperhour: 4,
        employmenttype: "parttime",
        position: "Outrider",
        company: undefined
    },
    {
        accountID: undefined,
        firstname: "Venti",
        lastname: "Barbatos",
        email: "venti@gmail.com",
        password: "venti123",
        role: "employee",
        employeeID: undefined,
        salaryperhour: 4,
        employmenttype: "parttime",
        position: "Bard",
        company: undefined
    },
    {
        accountID: undefined,
        firstname: "Aether",
        lastname: "Traveller",
        email: "aether@gmail.com",
        password: "aether123",
        role: "employee",
        employeeID: undefined,
        salaryperhour: 15,
        employmenttype: "fulltime",
        position: "Traveller",
        company: undefined
    },
]