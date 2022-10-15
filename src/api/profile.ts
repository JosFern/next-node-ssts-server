import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { account } from "../modules/account";
import { selectDB } from "../lib/database/query";

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
                    const data: any = await getJSONDataFromRequestStream(req)

                    const { firstname, lastname, email, password, role } = data

                    const acc: any = selectDB('Account', `accountID='${getResult.id}'`)

                    if (acc.length === 0) return { code: 404, message: "Account not found" }

                    const model = new account(
                        getResult.id,
                        firstname,
                        lastname,
                        email,
                        password,
                        role,
                    )

                    model.updateData()

                    response = { ...response, message: "Profile successfully updated" }

                    return response as returnMessage
                }

            case 'GET':
                {
                    if (!getResult?.id) {
                        const accounts = await selectDB('Account')
                        return accounts
                    } else {
                        const account: any = await selectDB('Account', `accountID='${getResult.id}'`)

                        if (account.length === 0) return { code: 404, message: "Account not found" }

                        return account[0]
                    }
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}