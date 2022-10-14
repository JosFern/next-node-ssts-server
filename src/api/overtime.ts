import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { overtime } from "../modules/overtime";
import { selectDB, updateDB } from "../lib/database/query";


export const overtimeRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/leave/:id')

    switch (req.method) {

        case 'POST':
            // FOR EMPLOYEE REQUESTING AN OVERTIME

            const postData: any = await getJSONDataFromRequestStream(req)

            const newOT = new overtime(
                undefined,
                postData.datehappen,
                postData.timestart,
                postData.timeend,
                postData.reason,
                postData.approved,
                getResult.id
            )

            newOT.insertOvertime()

            return "overtime request sent"

        case 'PUT':

            // FOR EMPLOYER TO APPROVE/DENY OVERTIME REQUEST

            const putData: object | any = await getJSONDataFromRequestStream(req)

            const stringFormat = ` approved=${putData.approved ? 1 : 0} `

            updateDB('Overtime', stringFormat, getResult.id, "id")

            return putData.approved ? "overtime approved" : "overtime denied"


        case 'GET':

            //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE OVERTIMES

            const overtimes = selectDB('Overtime', `employeeID='${getResult.id}'`)

            return overtimes

        default:
            break;
    }
}