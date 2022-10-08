
interface employee {
    id: number
    firstname: string
    lastname: string
    email: string
    salaryperhour: number
    employmenttype: string
    position: string
    company: number
}

export const employees: employee[] = [
    {
        id: 5,
        firstname: "Rex",
        lastname: "Lapis",
        email: "morax@gmail.com",
        salaryperhour: 10,
        employmenttype: "fulltime",
        position: "Geo Archon",
        company: 1
    },
    {
        id: 6,
        firstname: "Xiao",
        lastname: "Alatus",
        email: "xiao@gmail.com",
        salaryperhour: 8,
        employmenttype: "fulltime",
        position: "Vigilant Yaksha",
        company: 3
    },
    {
        id: 7,
        firstname: "Amber",
        lastname: "Teigrov",
        email: "amber@gmail.com",
        salaryperhour: 4,
        employmenttype: "parttime",
        position: "Outrider",
        company: 1
    },
    {
        id: 8,
        firstname: "Venti",
        lastname: "Barbatos",
        email: "venti@gmail.com",
        salaryperhour: 4,
        employmenttype: "parttime",
        position: "Bard",
        company: 1
    },
    {
        id: 9,
        firstname: "Aether",
        lastname: "Traveller",
        email: "aether@gmail.com",
        salaryperhour: 15,
        employmenttype: "fulltime",
        position: "Traveller",
        company: 2
    },
]