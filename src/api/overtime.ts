import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { overtimes } from "../../_data_/overtime";


export const overtimeRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/leave/:id')

    switch (req.method) {

        case 'POST':
            // FOR EMPLOYEE REQUESTING AN OVERTIME

            const postData = await getJSONDataFromRequestStream(req)

            console.log(postData);

            return "overtime request sent"

        case 'PUT':

            // FOR EMPLOYER TO APPROVE/DENY OVERTIME REQUEST

            const putData: any = await getJSONDataFromRequestStream(req)

            console.log({ ...putData, ...getResult });

            const status: string = putData.isApproved ? "Overtime Approved" : "Overtime Denied"

            return status


        case 'GET':

            //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE OVERTIMES

            const employee = _.filter(overtimes, { empID: Number(getResult.id) })

            console.log(employee);

            return employee



        default:
            break;
    }
}