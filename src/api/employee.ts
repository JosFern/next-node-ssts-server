import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { employees } from "../../_sample-data/employees";


export const employeeRequest = async (req: IncomingMessage) => {

    switch (req.method) {

        case 'POST':
            const postData = await getJSONDataFromRequestStream(req)
            console.log(postData);

            return "employee successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/employee/:id')

            console.log({ ...putData, ...putResult });


            return "employee successfully updated"


        case 'GET':
            const getResult = getPathParams(req.url as string, '/employer/:id')

            if (!getResult?.id) {
                return employees
            } else {
                const employee = _.find(employees, { id: Number(getResult.id) })

                return employee
            }

        default:
            break;
    }
}