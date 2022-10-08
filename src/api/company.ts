import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { companies } from "../../_sample-data/companies";


export const companyRequest = async (req: IncomingMessage) => {

    switch (req.method) {

        case 'POST':
            const postData = await getJSONDataFromRequestStream(req)
            console.log(postData);
            return "company successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/company/:id')

            console.log({ ...putData, ...putResult });


            return "company successfully updated"


        case 'GET':
            const getResult = getPathParams(req.url as string, '/company/:id')

            if (!getResult?.id) {
                return companies
            } else {
                console.log(getResult);
                const company = _.find(companies, { id: Number(getResult.id) })

                return company
            }

        default:
            break;
    }
}