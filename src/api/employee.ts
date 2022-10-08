import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { store } from "../modules/store";
import { v4 as uuidv4 } from 'uuid';
import { employees } from "../../_sample-data/employees";


export const employeeRequest = async (req: IncomingMessage) => {

    switch (req.method) {

        case 'POST':
            const postData: any = await getJSONDataFromRequestStream(req)

            const { firstname, lastname, email, password } = postData

            const id = uuidv4()

            store.postAccount({ accountID: id, firstname, lastname, email, password, role: "employee" })

            store.postEmployee({ ...postData, accountID: id })

            return "employee successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/employee/:id')

            console.log({ ...putData, ...putResult });

            store.putEmployee({ ...putData, ...putResult })

            return "employee successfully updated"


        case 'GET':
            const getResult = getPathParams(req.url as string, '/employer/:id')

            if (!getResult?.id) {
                return store.getEmployees()
                // return employees
            } else {

                return store.getEmployee(getResult.id)
                // const employee = _.find(employees, { id: Number(getResult.id) })

                // return employee
            }

        default:
            break;
    }
}