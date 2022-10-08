import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { absences } from "../../_sample-data/absences";


export const absenceRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/leave/:id')

    switch (req.method) {

        case 'POST':

            // FOR EMPLOYER SETTING AN ABSENCE TO EMPLOYEE

            const postData = await getJSONDataFromRequestStream(req)

            console.log(postData, getResult);

            return "absence set"

        case 'GET':

            //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE ABSENCES

            const employee = _.filter(absences, { empID: Number(getResult.id) })

            console.log(employee);

            return employee



        default:
            break;
    }
}