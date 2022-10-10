
interface company {
    id: number
    name: string
    allotedleaves: number
    overtimelimit: number
}

export const companies: company[] = [
    {
        id: 1,
        name: 'Workbean',
        allotedleaves: 6,
        overtimelimit: 25
    },
    {
        id: 2,
        name: 'Lemondrop',
        allotedleaves: 6,
        overtimelimit: 30
    },
    {
        id: 3,
        name: 'Syntactics',
        allotedleaves: 6,
        overtimelimit: 30
    },
]