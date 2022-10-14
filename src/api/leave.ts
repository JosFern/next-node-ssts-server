import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { leave } from "../modules/leaves";
import { selectDB, updateDB } from "../lib/database/query";


export const leaveRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/leave/:id')

    switch (req.method) {

        case 'POST':
            // FOR EMPLOYEE REQUESTING A LEAVE

            const postData: object | any = await getJSONDataFromRequestStream(req)

            console.log(postData);


            const postModel = new leave(
                undefined,
                postData.datestart,
                postData.dateend,
                postData.reason,
                postData.approved,
                getResult.id)

            postModel.insertLeave()

            return "leave request sent"

        case 'PUT':

            // FOR EMPLOYER TO APPROVE/DENY LEAVE REQUEST

            const putData: object | any = await getJSONDataFromRequestStream(req)

            const stringFormat = ` approved=${putData.approved ? 1 : 0} `

            updateDB('Leave', stringFormat, getResult.id, "id")

            return putData.approved ? "leave approved" : "leave denied"

        case 'GET':

            //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE LEAVES

            const leaves = selectDB('Leave', `employeeID='${getResult.id}'`)

            return leaves

        default:
            break;
    }
}