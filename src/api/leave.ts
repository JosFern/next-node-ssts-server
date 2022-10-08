import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { leaves } from "../../_sample-data/leave";


export const leaveRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/leave/:id')

    switch (req.method) {

        case 'POST':
            // FOR EMPLOYEE REQUESTING A LEAVE

            const postData = await getJSONDataFromRequestStream(req)

            console.log(postData);

            return "leave request sent"

        case 'PUT':

            // FOR EMPLOYER TO APPROVE/DENY LEAVE REQUEST

            const putData: any = await getJSONDataFromRequestStream(req)

            console.log({ ...putData, ...getResult });

            const status: string = putData.isApproved ? "Leave Approved" : "Leave Denied"

            return status


        case 'GET':

            //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE LEAVES

            const employee = _.filter(leaves, { empID: Number(getResult.id) })

            console.log(employee);

            return employee



        default:
            break;
    }
}