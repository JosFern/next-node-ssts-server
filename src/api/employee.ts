import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { find, map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { employee } from "../modules/employee";
import { deleteDB, selectDB } from "../lib/database/query";
import { account } from "../modules/account";
import { document } from "../lib/database/document";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

interface returnMessage {
    code: number
    message: string | any
}

export const employeeRequest = async (req: IncomingMessage) => {

    try {

        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/:id')

        switch (req.method) {

            case 'POST':
                {
                    const data: any = await getJSONDataFromRequestStream(req)

                    const { firstname, lastname, email, password, rate, empType, companyID, pos } = data

                    const statement = `email='${email}'`

                    const isExist = await selectDB('Account', statement)

                    if (isExist.length > 0) return { ...response, code: 409, message: "Email already exist" } as returnMessage

                    const accountID = uuidv4()

                    const newEmployee = new employee(undefined, accountID, rate, empType, companyID, pos)

                    await newEmployee.insertData()

                    const newAccount = new account(accountID, firstname, lastname, email, password, "employee")

                    await newAccount.insertData()

                    response = { ...response, code: 201, message: "Employee successfully added" }

                    return response as returnMessage
                }

            case 'PUT':
                {
                    const data: any = await getJSONDataFromRequestStream(req)

                    const { firstname, lastname, email, password, rate, empType, pos } = data

                    const statement = `employeeID='${getResult.id}'`

                    const getEmployee: any = await selectDB("Employee", statement)

                    if (getEmployee.length === 0) return { code: 404, message: "Employee not found" }

                    const getAccount: any = await selectDB('Account', `accountID='${getEmployee[0].accountID}'`)

                    if (getAccount.length === 0) return { code: 404, message: "Employee account not found" }

                    const accountModel = new account(getAccount[0].accountID, firstname, lastname, email, password, "employee")

                    await accountModel.updateData()

                    // const params = {
                    //     TableName: "Employee",
                    //     Key: {
                    //         employeeID: getResult.id,
                    //         accountID: getEmployee[0].accountID
                    //     },
                    //     UpdateExpression: "set rate = :r, empType = :t, pos = :p",
                    //     ExpressionAttributeValues: {
                    //         ":r": rate,
                    //         ":t": empType,
                    //         ":p": pos
                    //     },
                    // }

                    // const sent = await document.send(new UpdateCommand(params));

                    // console.log("Success - item added or updated", sent);

                    const employeeModel = new employee(getResult.id, getAccount[0].accountID, rate, empType, getEmployee[0].companyID, pos)

                    await employeeModel.updateData()

                    response = { ...response, message: "Employee successfully updated" }

                    return response as returnMessage
                }

            case 'GET':
                {
                    if (!getResult?.id) {

                        const employees = await selectDB('Employee')

                        const accounts = await selectDB('Account')

                        const employeesInfo = map(employees, (emp) => {
                            const accInfo = find(accounts, { accountID: emp.accountID })
                            return { ...emp, ...accInfo }
                        })

                        response = { ...response, message: employeesInfo }

                        return response as returnMessage

                    } else {

                        const employee: object | any = await selectDB('Employee', `employeeID='${getResult?.id}'`)

                        if (employee.length === 0) return { code: 404, message: "Employee not found" }

                        const account = await selectDB('Account', `accountID='${employee[0]?.accountID}'`)

                        if (account.length === 0) return { code: 404, message: "Employee account not found" }

                        const company = await selectDB('Company', `id='${employee[0]?.companyID}'`)

                        if (company.length === 0) return { code: 404, message: "Employee company not found" }

                        response = { ...response, message: { ...employee[0], ...account[0], ...company[0] } }

                        return response as returnMessage
                    }
                }

            case 'DELETE':

                {
                    const employeeInfo: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                    if (employeeInfo.length === 0) return { code: 404, message: "Employee not found" }

                    const accountInfo: object | any = await selectDB('Account', `accountID='${employeeInfo[0]?.accountID}'`)

                    if (accountInfo.length === 0) return { code: 404, message: "Employee account not found" }

                    const employeeModel = new employee(
                        getResult.id,
                        employeeInfo[0].accountID,
                        employeeInfo[0].rate,
                        employeeInfo[0].empType,
                        employeeInfo[0].companyID,
                        employeeInfo[0].pos
                    )

                    const accountModel = new account(
                        employeeInfo[0].accountID,
                        accountInfo[0].firstname,
                        accountInfo[0].lastname,
                        accountInfo[0].email,
                        accountInfo[0].password,
                        "employee"
                    )

                    await employeeModel.deleteData()

                    await accountModel.deleteData()

                    response = { ...response, message: "Employee successfully deleted" }

                    return response as returnMessage
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }
}