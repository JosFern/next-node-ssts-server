import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { company } from "../modules/company";
import { selectDB } from "../lib/database/query";

interface returnMessage {
    code: number
    message: string | any
}

export const companyRequest = async (req: IncomingMessage) => {
    try {

        let response: returnMessage = { code: 200, message: "Success" }

        const result = getPathParams(req.url as string, '/company/:id')

        switch (req.method) {

            case 'POST':
                {
                    const data: any = await getJSONDataFromRequestStream(req)

                    const { name, allotedleaves, overtimelimit } = data

                    const statement = `name='${name}'`

                    const isExist = await selectDB('Company', statement)

                    if (isExist.length > 0) return { ...response, code: 409, message: "Company name already exist" } as returnMessage

                    const model = new company(undefined, name, allotedleaves, overtimelimit)

                    await model.insertData()

                    response = { ...response, code: 201, message: "Company successfully created" }

                    return response
                }

            case 'PUT':
                {
                    const data: any = await getJSONDataFromRequestStream(req)

                    const { name, allotedleaves, overtimelimit } = data;

                    const putModel = new company(result.id, name, allotedleaves, overtimelimit)

                    await putModel.updateData()

                    response = { ...response, message: "Company successfully updated" }

                    return response

                }

            case 'GET':

                if (!result.id) {

                    const listing = await selectDB('Company')

                    response = { ...response, message: listing }

                    return response

                } else {

                    const statement = `id='${result.id}'`

                    const comp = await selectDB('Company', statement)

                    if (comp.length === 0) return { code: 404, message: "Company not found" }

                    response = { ...response, message: comp[0] }

                    return response
                }

            case 'DELETE':

                // const deleteResult = getPathParams(req.url as string, '/company/:id')

                // deleteDB("Company", deleteResult.id, "id", "name", or)

                response = { ...response, message: "Company successfully deleted" }

                return response


            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}