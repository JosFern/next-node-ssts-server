
interface absence {
    id: number
    empID: number
    datestart: string
    dateend: string
}

export const absences: absence[] = [
    {
        id: 1,
        empID: 5,
        datestart: "2022-10-24T14:00:00+08:00",
        dateend: "2022-10-25T14:00:00+08:00",
    },
    {
        id: 2,
        empID: 6,
        datestart: "2022-10-05T14:00:00+08:00",
        dateend: "2022-10-08T14:00:00+08:00",
    },
    {
        id: 3,
        empID: 5,
        datestart: "2022-10-27T14:00:00+08:00",
        dateend: "2022-10-27T14:00:00+08:00",
    },
]