
interface overtime {
    datehappen: string
    timestart: string
    timeend: string
    reason: string
    approved: boolean
}

export const overtimes: overtime[] = [
    {
        datehappen: "2022-10-05T14:00:00+08:00",
        timestart: "2022-10-05T14:00:00+08:00",
        timeend: "2022-10-05T18:00:00+08:00",
        reason: "fox some bugs",
        approved: true
    },
    {
        datehappen: "2022-10-06T14:00:00+08:00",
        timestart: "2022-10-06T14:00:00+08:00",
        timeend: "2022-10-06T18:00:00+08:00",
        reason: "maintenance",
        approved: false
    },
    {
        datehappen: "2022-10-07T14:00:00+08:00",
        timestart: "2022-10-07T14:00:00+08:00",
        timeend: "2022-10-07T18:00:00+08:00",
        reason: "emergency",
        approved: true
    },
]