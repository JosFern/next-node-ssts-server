import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { employers } from "../../_sample-data/employers";


export const employerRequest = async (req: IncomingMessage) => {

    switch (req.method) {

        case 'POST':

            const postData = await getJSONDataFromRequestStream(req)

            console.log(postData);

            return "employer successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/employer/:id')

            console.log({ ...putData, ...putResult });


            return "employer successfully updated"


        case 'GET':
            const getResult = getPathParams(req.url as string, '/employer/:id')

            if (!getResult?.id) {
                return employers
            } else {
                const employer = _.find(employers, { id: Number(getResult.id) })

                return employer
            }

        default:
            break;
    }
}