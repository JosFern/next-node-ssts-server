import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { accounts } from "../../_sample-data/accounts";


export const accountRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/profile/:id')

    switch (req.method) {

        case 'POST':

            const postData = await getJSONDataFromRequestStream(req)

            console.log(postData);

            return "account successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            console.log({ ...putData, ...getResult });


            return "profile successfully updated"


        case 'GET':

            if (!getResult?.id) {
                return accounts
            } else {
                const account = _.find(accounts, { id: Number(getResult.id) })

                return account
            }

        default:
            break;
    }
}