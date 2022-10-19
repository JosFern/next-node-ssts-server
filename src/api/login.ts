import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { selectDB } from "../lib/database/query";
import * as jose from 'jose'
import * as dotenv from 'dotenv';
import { generateToken } from "../util/generateToken";
dotenv.config()

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

                    const { email, password } = data

                    const statement = `email='${email}'`

                    const account = await selectDB('Account', statement)

                    if (account.length === 0) return { ...response, code: 400, message: "Account doesn't exist" } as returnMessage

                    if (account[0].password !== password) return { ...response, code: 400, message: "Password is invalid" } as returnMessage

                    // const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjY2MDg4NDU2LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsImV4cCI6MTY2NjA5NTY1Nn0.XZRLt6bvQ8HxBgEUHw8H6cBECronf6IgfoQiSwNSNVw"

                    // const claims = jose.decodeJwt(jwt)
                    // console.log(claims)

                    // const protectedHeader = jose.decodeProtectedHeader(jwt)
                    // console.log(protectedHeader)

                    const jwt = await generateToken(account[0])

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