import { ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { map } from "lodash";
import { document } from "./document";
import { itemToData } from "dynamo-converters";

export const execute = async (params: any) => {
    try {
        const valuesResponse = await document.send(new ExecuteStatementCommand(params));
        console.log("Success");
        return valuesResponse;
    } catch (err) {
        console.error(err);
        throw new Error("Error occured");
    }
}

export const insertDB = async (tableName: string, statement: string, parameters: any[]) => {
    const params = {
        Statement: `INSERT INTO ${tableName} VALUE ${statement}`,
        Parameters: parameters
    };
    await execute(params)
    return "Successfully Save"
};

export const selectDB = async (tableName: string, statement: string = '') => {
    const query = statement.length > 0 ? `SELECT * FROM  ${tableName} WHERE ${statement}` : `SELECT * FROM  ${tableName}`
    const params = {
        Statement: query,
    };
    const resultList = await execute(params)
    return map(resultList.Items, (obj) => itemToData(obj))
}

export const joinSelectDB = async (tableName: string, assocTables: string, leftJoin: string) => {
    const query = `SELECT ${assocTables} FROM ${tableName} LEFT JOIN ${leftJoin}`

    const params = {
        Statement: query,
    };
    const resultList = await execute(params)
    return map(resultList.Items, (obj) => itemToData(obj))
}

export const updateDB = async (tableName: string, statement: string, id: string, idAttribute: string,
    sortAttribute: string = '', sortValue: string = '') => {

    const query = sortAttribute.length > 0 ?
        `UPDATE ${tableName} SET ${statement} WHERE ${idAttribute}='${id}' AND ${sortAttribute}='${sortValue}'` : `UPDATE ${tableName} SET ${statement} WHERE ${idAttribute}='${id}'`

    console.log("query: " + query);

    const params = {
        Statement: query,
    }

    await execute(params)
}

export const deleteDB = async (tableName: string, id: string, idAttribute: string, sortAttribute: string = '', sortValue: string = '') => {

    const query = sortAttribute.length > 0 ?
        `DELETE FROM ${tableName} WHERE ${idAttribute}='${id}' AND ${sortAttribute}='${sortValue}'` : `DELETE FROM ${tableName} WHERE ${idAttribute}='${id}'`

    const params = {
        Statement: query
    }

    await execute(params)
}