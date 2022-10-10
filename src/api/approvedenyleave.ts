import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';

export const approvedenyLeaveRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/:id/leave/:date')

    switch (req.method) {

        case 'PUT':

            // FOR EMPLOYER TO APPROVE/DENY LEAVE REQUEST

            const putData: object | any = await getJSONDataFromRequestStream(req)

            console.log(getResult);

            const status: string = putData.isApproved ? "Leave Approved" : "Leave Denied"

            return status
        default:
            break;
    }
}