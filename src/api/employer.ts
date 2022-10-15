import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { find, map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { employer } from "../modules/employer";
import { deleteDB, selectDB } from "../lib/database/query";
import { account } from "../modules/account";

interface returnMessage {
    code: number
    message: string | any
}

export const employerRequest = async (req: IncomingMessage) => {

    try {

        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employer/:id')

        switch (req.method) {

            case 'POST':
                {
                    const data: any = await getJSONDataFromRequestStream(req)

                    const { firstname, lastname, email, password, companyID } = data

                    const statement = `email='${email}'`

                    const isExist = await selectDB('Account', statement)

                    if (isExist.length > 0) return { ...response, code: 409, message: "Email already exist" } as returnMessage

                    const accountID = uuidv4()

                    const newEmployer = new employer(undefined, accountID, companyID)

                    await newEmployer.insertData()

                    const newAccount = new account(accountID, firstname, lastname, email, password, "employer")

                    await newAccount.insertData()

                    response = { ...response, code: 201, message: "Employer successfully added" }

                    return response as returnMessage
                }

            case 'PUT':
                {

                    const data: any = await getJSONDataFromRequestStream(req)

                    const { firstname, lastname, email, password } = data

                    const statement = `employerID='${getResult.id}'`

                    const empInfo: any = await selectDB("Employer", statement)

                    if (empInfo.length === 0) return { code: 404, message: "Employer not found" }

                    const model = new account(empInfo[0].accountID, firstname, lastname, email, password, "employer")

                    await model.updateData()

                    response = { ...response, message: "Employer successfully updated" }

                    return response as returnMessage
                }

            case 'GET':
                {
                    if (!getResult?.id) {

                        const employers = await selectDB('Employer')

                        const accounts = await selectDB('Account')

                        const employersInfo = map(employers, (emp) => {
                            const accInfo = find(accounts, { accountID: emp.accountID })
                            return { ...emp, ...accInfo }
                        })

                        response = { ...response, message: employersInfo }

                        return response

                    } else {

                        const employer: object | any = await selectDB('Employer', `employerID='${getResult?.id}'`)
                        console.log(employer);

                        if (employer.length === 0) return { code: 404, message: "Employer not found" }

                        const account = await selectDB('Account', `accountID='${employer[0]?.accountID}'`)

                        if (account.length === 0) return { code: 404, message: "Employer account not found" }

                        response = { ...response, message: { ...employer[0], ...account[0] } }

                        return response as returnMessage
                    }
                }

            case 'DELETE':
                {
                    const employer: object | any = await selectDB('Employer', `employerID='${getResult.id}'`)

                    if (employer.length === 0) return { code: 404, message: "Employer not found" }

                    const account: object | any = await selectDB('Account', `accountID='${employer[0]?.accountID}'`)

                    if (account.length === 0) return { code: 404, message: "Employer account not found" }

                    deleteDB("Account", getResult.id, "accountID", "email", account[0].email)
                    deleteDB('Employer', getResult.id, "employerID", "accountID", account[0].accountID)

                    response = { ...response, message: "Employer successfully deleted" }

                    return response as returnMessage
                }

            default:
                break;

        }
    } catch (err) {
        console.log("error: " + err);

    }
}