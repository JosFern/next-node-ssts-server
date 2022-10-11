import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

import { client } from '../lib/client/dynamo'

//set parameters
const params = {
    AttributeDefinitions: [
        {
            AttributeName: "employerID", //ATTRIBUTE_NAME_2
            AttributeType: "S", //ATTRIBUTE_TYPE 
        },
        {
            AttributeName: "accountID", //ATTRIBUTE_NAME_2
            AttributeType: "S", //ATTRIBUTE_TYPE 
        }
    ],
    KeySchema: [
        {
            AttributeName: "employerID",
            KeyType: "HASH",
        },
        {
            AttributeName: "accountID",
            KeyType: "RANGE",
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
    TableName: "Employer", //TABLE_NAME
    StreamSpecification: {
        StreamEnabled: false,
    }

};

const run = async () => {
    try {
        const data = await client.send(new CreateTableCommand(params));
        console.log("Table created", data)
        return data;
    } catch (err) {
        console.log(err);

    }
}

run();