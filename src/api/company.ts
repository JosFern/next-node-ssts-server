import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../util/generateParams";
import _ from 'lodash';
import { store } from "../modules/store";
import { company } from "../modules/company";
import { deleteDB, selectDB } from "../lib/database/query";

interface companyData {
    name: string
    allotedleaves: number
    overtimelimit: number
    origName: string
}

export const companyRequest = async (req: IncomingMessage) => {
    try {

        switch (req.method) {

            case 'POST':
                const postData: companyData | any = await getJSONDataFromRequestStream(req)
                console.log(postData);

                const { name, allotedleaves, overtimelimit } = postData

                const postModel = new company(undefined, name, allotedleaves, overtimelimit)

                postModel.insertCompany()

                return "company successfully added"

            case 'PUT':

                const putData: companyData | any = await getJSONDataFromRequestStream(req)

                const putResult = getPathParams(req.url as string, '/company/:id')

                const putModel = new company(putResult.id, putData.name, putData.allotedleaves, putData.overtimelimit)

                putModel.updateCompany(putData.origName)

                return "company successfully updated"


            case 'GET':
                const getResult = getPathParams(req.url as string, '/company/:id')

                if (!getResult?.id) {

                    const listing = await selectDB('Company')

                    return listing

                } else {

                    const statement = `id='${getResult?.id}'`

                    const comp = await selectDB('Company', statement)

                    return comp[0]
                }

            case 'DELETE':

                // const deleteResult = getPathParams(req.url as string, '/company/:id')

                // deleteDB("Company", deleteResult.id, "id", "name", or)

                return "company successfully deleted"


            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}