import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { companies } from "../../_sample-data/companies";
import { store } from "../modules/store";

export const companyRequest = async (req: IncomingMessage) => {

    switch (req.method) {

        case 'POST':
            const postData: any = await getJSONDataFromRequestStream(req)
            console.log(postData);

            store.postCompany({ ...postData })

            return "company successfully added"

        case 'PUT':

            const putData: any = await getJSONDataFromRequestStream(req)

            const putResult = getPathParams(req.url as string, '/company/:id')

            console.log({ ...putData, ...putResult });

            store.putCompany({ ...putData, ...putResult })


            return "company successfully updated"


        case 'GET':
            const getResult = getPathParams(req.url as string, '/company/:id')

            if (!getResult?.id) {
                console.log(store.getCompanies());

                return store.getCompanies()

                //return companies
            } else {

                return store.getCompany(getResult.id)

                // const company = _.find(companies, { id: Number(getResult.id) })

                // return company
            }

        default:
            break;
    }
}