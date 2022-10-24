import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { company } from "../modules/company";
import { deleteDB, selectDB } from "../lib/database/query";
import { slice } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { encryptToken, validateToken } from "../util/generateToken";

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
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['admin'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //VALIDATE ENCRYPTED COMPANY DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { name, allotedleaves, overtimelimit } = validateData

                    //QUERY COMPANY NAMES IF IT EXIST
                    const statement = `name='${name}'`

                    const isExist = await selectDB('Company', statement)

                    if (isExist.length > 0) return { ...response, code: 409, message: "Company name already exist" } as returnMessage

                    //INSERTING THE NEW COMPANY DATA
                    const model = new company(undefined, name, allotedleaves, overtimelimit)

                    await model.insertData()

                    response = { ...response, code: 201, message: "Company successfully created" }

                    return response
                }

            case 'PUT':
                {
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['admin'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //VALIDATE ENCRYPTED COMPANY DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { name, allotedleaves, overtimelimit } = validateData;

                    //QUERY IF COMPANY EXIST
                    const statement = `id='${result.id}'`

                    const compInfo: any = await selectDB("Company", statement)

                    if (compInfo.length === 0) return { code: 404, message: "Company not found" }

                    //UPDATING THE COMPANY DATA
                    const putModel = new company(result.id, name, allotedleaves, overtimelimit)

                    await putModel.updateData()

                    response = { ...response, message: "Company successfully updated" }

                    return response

                }

            case 'GET':
                {
                    if (!result.id) {

                        // VALIDATE USER TOKEN
                        const getToken = req.headers.authorization

                        const validateJwt = await validateToken(getToken, ['admin'])

                        if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                        if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                        //QUERY LIST OF ALL COMPANIES
                        const listing = await selectDB('Company')

                        //ENCRYPT COMPANIES
                        const jwt = await encryptToken(listing)

                        response = { ...response, message: jwt }

                        return response

                    } else {

                        // NOT YET UPDATED
                        const getToken = req.headers.authorization

                        const validateJwt = await validateToken(getToken, ['admin', 'employee', 'employer'])

                        if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                        if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                        const statement = `id='${result.id}'`

                        const company = await selectDB('Company', statement)

                        if (company.length === 0) return { code: 404, message: "Company not found" }

                        response = { ...response, message: company[0] }

                        return response
                    }
                }

            case 'DELETE':
                {
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['admin'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //QUERY COMPANY IF EXIST
                    const companyInfo: object | any = await selectDB('Company', `id='${result.id}'`)

                    if (companyInfo.length === 0) return { code: 404, message: "Company not found" }

                    //DELETING COMPANY
                    const model = new company(
                        result.id,
                        companyInfo[0].name,
                        companyInfo[0].allocateLeaves,
                        companyInfo[0].allocateOvertime,
                    )

                    console.log('deleting company assoc');

                    await model.deleteAssociates()

                    console.log('deleting company');

                    await model.deleteData()

                    response = { ...response, message: "Company successfully deleted" }

                    return response
                }


            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}