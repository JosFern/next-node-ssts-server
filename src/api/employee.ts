import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _, { find, map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { employee } from "../modules/employee";
import { deleteDB, selectDB } from "../lib/database/query";
import { account } from "../modules/account";


export const employeeRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/:id')

    switch (req.method) {

        case 'POST':
            const postData: any = await getJSONDataFromRequestStream(req)

            const { firstname, lastname, email, password, salaryperhour, employmenttype, companyID, position } = postData

            const accountID = uuidv4()

            const newEmployer = new employee(undefined, accountID, salaryperhour, employmenttype, companyID, position)

            const newAccount = new account(accountID, firstname, lastname, email, password, "employee")

            // newEmployer.insertEmployee()

            return "employee successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const emplye: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

            // const putModel = new employee(
            //     emplye[0]?.accountID,   //accountID
            //     putData.firstname,      //firstname
            //     putData.lastname,       //lastname
            //     putData.email,          //email
            //     putData.password,       //password
            //     "employee",             //employee
            //     getResult.id,           //employeeID
            //     putData.salaryperhour,  //salaryperhour
            //     putData.employmenttype, //type
            //     putData.companyID,      //companyID
            //     putData.position,       //position 
            // )

            // putModel.updateEmployee()

            // putModel.updateAccount(putData.origEmail)

            return "employee successfully updated"


        case 'GET':

            if (!getResult?.id) {

                const employees = await selectDB('Employee')

                const accounts = await selectDB('Account')

                const employersInfo = map(employees, (emp) => {
                    const accInfo = find(accounts, { accountID: emp.accountID })
                    return { ...emp, ...accInfo }
                })

                return employersInfo

            } else {

                const employee: object | any = await selectDB('Employee', `employeeID='${getResult?.id}'`)

                const account = await selectDB('Account', `accountID='${employee[0]?.accountID}'`)

                return { ...employee[0], ...account[0] }
            }

        case 'DELETE':

            const emp: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

            const acc: object | any = await selectDB('Account', `accountID='${emp[0]?.accountID}'`)

            deleteDB("Account", acc[0].accountID, "accountID", "email", acc[0].email)
            deleteDB('Employee', getResult.id, "employeeID", "accountID", acc[0].accountID)

            return "employee successfully deleted"

        default:
            break;
    }
}