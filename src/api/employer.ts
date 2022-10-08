import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { employers } from "../../_sample-data/employers";
import { store } from "../modules/store";

export const employerRequest = async (req: IncomingMessage) => {

    switch (req.method) {

        case 'POST':

            const postData: any = await getJSONDataFromRequestStream(req)

            const { firstname, lastname, email, password } = postData

            const id = uuidv4()

            console.log({ ...postData, id, role: "employer" });

            store.postAccount({ accountID: id, firstname, lastname, email, password, role: "employer" })

            store.postEmployer({ ...postData, accountID: id })

            return "employer successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/employer/:id')

            console.log({ ...putData, ...putResult });

            store.putEmployer({ ...putData, ...putResult })

            return "employer successfully updated"


        case 'GET':
            const getResult = getPathParams(req.url as string, '/employer/:id')

            if (!getResult?.id) {

                return store.getEmployers()

                // return employers
            } else {

                return store.getEmployer(getResult.id)

                // const employer = _.find(employers, { id: Number(getResult.id) })

                // return employer
            }

        default:
            break;
    }
}