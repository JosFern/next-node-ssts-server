
interface overtime {
    id: number
    empID: number
    datehappen: string
    timestart: string
    timeend: string
    reason: string
    status: string
}

export const overtimes: overtime[] = [
    {
        id: 1,
        empID: 5,
        datehappen: "2022-10-05T14:00:00+08:00",
        timestart: "2022-10-05T14:00:00+08:00",
        timeend: "2022-10-05T18:00:00+08:00",
        reason: "fox some bugs",
        status: "pending"
    },
    {
        id: 2,
        empID: 6,
        datehappen: "2022-10-06T14:00:00+08:00",
        timestart: "2022-10-06T14:00:00+08:00",
        timeend: "2022-10-06T18:00:00+08:00",
        reason: "maintenance",
        status: "pending"
    },
    {
        id: 3,
        empID: 5,
        datehappen: "2022-10-07T14:00:00+08:00",
        timestart: "2022-10-07T14:00:00+08:00",
        timeend: "2022-10-07T18:00:00+08:00",
        reason: "emergency",
        status: "pending"
    },
]