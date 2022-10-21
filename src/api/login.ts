import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { selectDB } from "../lib/database/query";
import { decryptToken, encryptToken, generateToken, validateToken } from "../util/generateToken";
import * as jose from 'jose'

interface returnMessage {
    code: number
    message: string | any
}

export const loginRequest = async (req: IncomingMessage) => {
    try {

        let response: returnMessage = { code: 200, message: "Success" }

        const result = getPathParams(req.url as string, '/login')

        switch (req.method) {

            case 'POST':
                {
                    const data: any = await getJSONDataFromRequestStream(req)

                    console.log(data);

                    const payload: any = await validateToken(data)

                    const { email, password } = payload

                    const statement = `email='${email}'`

                    const account = await selectDB('Account', statement)

                    if (account.length === 0) return { ...response, code: 400, message: "Account doesn't exist" } as returnMessage

                    if (account[0].password !== password) return { ...response, code: 400, message: "Password is invalid" } as returnMessage

                    const jwt = await encryptToken(account[0])

                    response = { ...response, code: 200, message: jwt }

                    return response
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}