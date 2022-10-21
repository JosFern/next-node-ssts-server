import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { find, map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { employer } from "../modules/employer";
import { deleteDB, selectDB } from "../lib/database/query";
import { account } from "../modules/account";
import { encryptToken, validateToken } from "../util/generateToken";

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
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['admin'])

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //VALIDATE ENCRYPTED EMPLOYER DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { firstname, lastname, email, password, companyID } = validateData

                    //QUERY EMAILS IF IT EXIST
                    const statement = `email='${email}'`

                    const isExist = await selectDB('Account', statement)

                    if (isExist.length > 0) return { ...response, code: 409, message: "Email already exist" } as returnMessage

                    //INSERTING NEW EMPLOYER DATA
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
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['admin'])

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //VALIDATE ENCRYPTED EMPLOYER DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { firstname, lastname, email, password } = validateData

                    //QUERY IF EMPLOYER EXIST
                    const statement = `employerID='${getResult.id}'`

                    const empInfo: any = await selectDB("Employer", statement)

                    if (empInfo.length === 0) return { code: 404, message: "Employer not found" }

                    //UPDATING EMPLOYER DATA
                    const model = new account(empInfo[0].accountID, firstname, lastname, email, password, "employer")

                    await model.updateData()

                    response = { ...response, message: "Employer successfully updated" }

                    return response as returnMessage
                }

            case 'GET':
                {
                    if (!getResult?.id) {

                        // VALIDATE USER TOKEN
                        const getToken = req.headers.authorization

                        const validateJwt = await validateToken(getToken, ['admin'])

                        if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                        //QUERY ALL EMPLOYER AND ASSOCIATED ACCOUNT & COMPANY
                        const employers = await selectDB('Employer')

                        const accounts = await selectDB('Account')

                        const companies = await selectDB('Company')

                        const employersInfo = map(employers, (emp) => {
                            const accInfo = find(accounts, { accountID: emp.accountID })
                            const accCompInfo = find(companies, { id: emp.companyID })
                            return { ...emp, ...accInfo, ...accCompInfo }
                        })

                        //ENCRYPT EMPLOYERS
                        const jwt = await encryptToken(employersInfo)

                        response = { ...response, message: jwt }

                        return response

                    } else {

                        //NOT YET FINISHED
                        const getToken = req.headers.authorization

                        const validateJwt = await validateToken(getToken, ['admin', 'employer'])

                        if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                        if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

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
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['admin'])

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //QUERY EMPLOYER IF EXIST
                    const employerInfo: object | any = await selectDB('Employer', `employerID='${getResult.id}'`)

                    if (employerInfo.length === 0) return { code: 404, message: "Employer not found" }

                    const accountInfo: object | any = await selectDB('Account', `accountID='${employerInfo[0]?.accountID}'`)

                    if (accountInfo.length === 0) return { code: 404, message: "Employer account not found" }

                    //DELETING EMPLOYER
                    const employerModel = new employer(
                        getResult.id,
                        employerInfo[0].accountID,
                        employerInfo[0].companyID
                    )

                    const accountModel = new account(
                        employerInfo[0].accountID,
                        accountInfo[0].firstname,
                        accountInfo[0].lastname,
                        accountInfo[0].email,
                        accountInfo[0].password,
                        "employer"
                    )

                    await employerModel.deleteData()

                    await accountModel.deleteData()

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