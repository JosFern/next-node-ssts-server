interface leave {
    id: number
    empID: number
    datestart: string
    dateend: string
    reason: string
    status: string
}

export const leaves: leave[] = [
    {
        id: 1,
        empID: 5,
        datestart: "2022-10-05T14:00:00+08:00",
        dateend: "2022-10-08T14:00:00+08:00",
        reason: "family emergency",
        status: "pending"
    },
    {
        id: 2,
        empID: 6,
        datestart: "2022-10-05T14:00:00+08:00",
        dateend: "2022-10-08T14:00:00+08:00",
        reason: "family vacation",
        status: "pending"
    },
    {
        id: 3,
        empID: 5,
        datestart: "2022-10-09T14:00:00+08:00",
        dateend: "2022-10-09T14:00:00+08:00",
        reason: "home sick",
        status: "pending"
    },
]