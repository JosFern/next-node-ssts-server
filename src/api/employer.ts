import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { find, map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { store } from "../modules/store";
import { employer } from "../modules/employer";
import { deleteDB, selectDB } from "../lib/database/query";

export const employerRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employer/:id')

    switch (req.method) {

        case 'POST':

            const postData: any = await getJSONDataFromRequestStream(req)

            const { firstname, lastname, email, password, companyID } = postData

            const id = uuidv4()

            const newEmployer = new employer(id, firstname, lastname, email, password, "employer", undefined, companyID)

            newEmployer.insertEmployer()

            return "employer successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/employer/:id')

            const emplyr: object | any = await selectDB('Employer', `employerID='${putResult.id}'`)

            const putModel = new employer(
                emplyr[0]?.accountID,   //accountID
                putData.firstname,      //firstname
                putData.lastname,       //lastname
                putData.email,          //email
                putData.password,       //password
                "employer",             //employer
                putResult.id,           //employerID
                putData.companyID       //companyID
            )

            if (putData.companyID !== emplyr[0]?.companyID) putModel.updateEmployerCompany()

            putModel.updateAccount(putData.origEmail)

            return "employer successfully updated"


        case 'GET':

            if (!getResult?.id) {

                const employers = await selectDB('Employer')

                const accounts = await selectDB('Account')

                const employersInfo = map(employers, (emp) => {
                    const accInfo = find(accounts, { accountID: emp.accountID })
                    return { ...emp, ...accInfo }
                })

                return employersInfo

            } else {

                const employer: object | any = await selectDB('Employer', `employerID='${getResult?.id}'`)
                console.log(employer);


                const account = await selectDB('Account', `accountID='${employer[0]?.accountID}'`)

                return { ...employer[0], ...account[0] }
            }

        case 'DELETE':

            const emp: object | any = await selectDB('Employer', `employerID='${getResult.id}'`)

            const acc: object | any = await selectDB('Account', `accountID='${emp[0]?.accountID}'`)

            deleteDB("Account", acc[0].accountID, "accountID", "email", acc[0].email)
            deleteDB('Employer', getResult.id, "employerID", "accountID", acc[0].accountID)

            return "employer successfully deleted"

        default:
            break;
    }
}