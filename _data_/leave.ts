interface leave {
    datestart: string
    dateend: string
    reason: string
    approved: boolean
}

export const leaves: leave[] = [
    {
        datestart: "2022-10-05T14:00:00+08:00",
        dateend: "2022-10-08T14:00:00+08:00",
        reason: "family emergency",
        approved: false
    },
    {
        datestart: "2022-10-05T14:00:00+08:00",
        dateend: "2022-10-08T14:00:00+08:00",
        reason: "family vacation",
        approved: true
    },
    {
        datestart: "2022-10-09T14:00:00+08:00",
        dateend: "2022-10-09T14:00:00+08:00",
        reason: "home sick",
        approved: true
    },
]