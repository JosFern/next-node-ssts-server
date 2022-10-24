import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { account } from "../modules/account";
import { selectDB } from "../lib/database/query";
import { encryptToken, validateToken } from "../util/generateToken";

interface returnMessage {
    code: number
    message: string | any
}

export const accountRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/profile/:id')

        switch (req.method) {

            case 'PUT':
                {
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee', 'employer', 'admin'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    const { accountID } = validateJwt

                    //VALIDATE ENCRYPTED PROFILE DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { firstname, lastname, email, password, role } = validateData

                    //QUERY IF ACCOUNT EXIST
                    const acc: any = selectDB('Account', `accountID='${accountID}'`)

                    if (acc.length === 0) return { code: 404, message: "Account not found" }

                    //UPDATING THE ACCOUNT DATA
                    const model = new account(
                        accountID,
                        firstname,
                        lastname,
                        email,
                        password,
                        role,
                    )

                    await model.updateData()

                    const statement = `email='${email}'`

                    const accountInfo = await selectDB('Account', statement)

                    if (accountInfo.length === 0) return { ...response, code: 400, message: "Account doesn't exist" } as returnMessage

                    const jwt = await encryptToken(accountInfo[0])

                    response = { ...response, message: jwt }

                    return response as returnMessage
                }

            case 'GET':
                {
                    if (!getResult?.id) {

                        const getToken = req.headers.authorization

                        const validateJwt = await validateToken(getToken, ['admin'])

                        if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                        if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                        const accounts = await selectDB('Account')

                        response = { ...response, message: accounts }

                        return response as returnMessage

                    } else {
                        const getToken = req.headers.authorization

                        const validateJwt = await validateToken(getToken, ['employee', 'employer', 'admin'])

                        if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                        if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                        const account: any = await selectDB('Account', `accountID='${getResult.id}'`)

                        if (account.length === 0) return { code: 404, message: "Account not found" }

                        response = { ...response, message: account }

                        return response as returnMessage
                    }
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}