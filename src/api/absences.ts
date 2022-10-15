import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { absence } from "../modules/absences";
import { deleteDB, selectDB } from "../lib/database/query";

interface returnMessage {
    code: number
    message: string | any
}

export const absenceRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/absence/:id')

        switch (req.method) {

            case 'POST':
                {
                    // FOR EMPLOYER SETTING AN ABSENCE TO EMPLOYEE

                    const data: any = await getJSONDataFromRequestStream(req)

                    const { dateStart, dateEnd } = data

                    const model = new absence(undefined, dateStart, dateEnd, getResult.id)

                    model.insertData()

                    response = { ...response, code: 201, message: "Employee Absence Set" }

                    return response as returnMessage
                }

            case 'GET':
                {
                    //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE ABSENCES

                    const employee: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                    if (employee.length === 0) return { code: 404, message: "Employee not found" }

                    const absences = await selectDB('Absence', `employeeID='${getResult.id}'`)

                    response = { ...response, message: absences }

                    return response as returnMessage
                }

            case 'DELETE':

                {
                    deleteDB("Absence", getResult.id, "id")

                    response = { ...response, message: "Absence successfully deleted" }

                    return response as returnMessage
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err)

    }
}