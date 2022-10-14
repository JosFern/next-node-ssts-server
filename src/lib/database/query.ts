import { ExecuteStatementCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { map, values } from "lodash";
import { document } from "./document";
import { dataToItem, itemToData } from "dynamo-converters";

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

export const insertDB = async (tableName: string, statement: string, parameters: any) => {
    const params = {
        Statement: `INSERT INTO ${tableName} VALUE ${statement}`,
        Parameters: values(dataToItem(parameters))
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

export const updateDB = async (tableName: string, statement: string, parameters: any, where: string) => {
    const params = {
        Statement: `UPDATE ${tableName} SET ${statement} WHERE ${where}`,
        Parameters: values(dataToItem(parameters))
    };
    console.log(dataToItem(parameters))
    console.log(values(dataToItem(parameters)))
    await execute(params)
    return "Successfully Update"
};

export const deleteDB = async (tableName: string, id: string, idAttribute: string, sortAttribute: string = '', sortValue: string = '') => {

    const query = sortAttribute.length > 0 ?
        `DELETE FROM ${tableName} WHERE ${idAttribute}='${id}' AND ${sortAttribute}='${sortValue}'` : `DELETE FROM ${tableName} WHERE ${idAttribute}='${id}'`

    const params = {
        Statement: query
    }

    await execute(params)
}

export const getTableSchema = async (table: string) => {
    const params: any = {
        TableName: table
    }
    const command = new DescribeTableCommand(params)

    try {
        const data: any = await document.send(command)
        if (data) return data.Table.KeySchema

    } catch (err) {
        console.log("Describe table failed.");
    }


}