import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { absences } from "../../_data_/absences";
import { absence } from "../modules/absences";


export const absenceRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/absence/:id')

    switch (req.method) {

        case 'POST':

            // FOR EMPLOYER SETTING AN ABSENCE TO EMPLOYEE

            const postData: any = await getJSONDataFromRequestStream(req)

            const postModel = new absence(postData.datestart, postData.dateend, getResult.id)

            postModel.insertAbsence()

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