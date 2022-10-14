import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { account } from "../modules/account";
import { selectDB } from "../lib/database/query";


export const accountRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/profile/:id')

    switch (req.method) {

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putAccount = new account(
                getResult.id,
                putData.firstname,
                putData.lastname,
                putData.email,
                putData.password,
                putData.role,
            )

            putAccount.updateAccount(putData.origEmail)

            return "profile successfully updated"


        case 'GET':

            if (!getResult?.id) {
                const accs = selectDB('Account')
                return accs
            } else {
                const acc = selectDB('Account', `accountID='${getResult.id}'`)
                return acc
            }

        default:
            break;
    }
}