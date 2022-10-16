import { assign, chain, keys, map, values } from "lodash"
import { deleteDB, getTableSchema, insertDB, updateDB } from "../lib/database/query"

interface keySchema {
    AttributeName: string
    KeyType: string
}

export abstract class dbOperations {

    private data: object | any

    assignData = (modelData: object) => {
        this.data = { ...modelData }
    }

    //CUT OUT TABLE, PRIMARY AND SECONDAY KEY IN OBJECT
    filterData = (data: object | any, schemas: keySchema[] = []) => {
        const getVal = map(schemas, schema => values(schema)[0])
        const newData = keys(data)
            .filter(key => {

                if (schemas.length === 0) return key !== "TABLE"

                return key !== "TABLE" && !getVal.includes(key)
            })
            .reduce((cur, key) => { return assign(cur, { [key]: data[key] }) }, {});

        return newData
    }

    insertData = async () => {
        const { TABLE } = this.data

        const newData = this.filterData(this.data)

        const fields = keys(newData)
        const params = values(newData)

        const stringFormat = map(fields, (field) => `'${field}': ? `)

        const statement = `{ ${stringFormat.join()} }`

        try {
            await insertDB(TABLE, statement, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }

    updateData = async () => {
        const { TABLE } = this.data

        const schemas: keySchema[] | any = await getTableSchema(TABLE)

        const newData = this.filterData(this.data, schemas)

        const fields = keys(newData)
        const params = values(newData)

        const setFormat = map(fields, field => ` ${field}=? `)

        const whereFormat = chain(schemas)
            .map(schema => values(schema)[0])
            .map(key => ` ${key}='${this.data[key]}'`)
            .value()

        try {
            await updateDB(TABLE, setFormat.join(), params, whereFormat.join(" AND "))
        } catch (err) {
            console.error(err)
            throw new Error("Unable to update");
        }
    }

    deleteData = async () => {
        const { TABLE } = this.data

        const schemas: keySchema[] | any = await getTableSchema(TABLE)

        const whereFormat = chain(schemas)
            .map(schema => values(schema)[0])
            .map(key => ` ${key}='${this.data[key]}'`)
            .value()

        try {
            await deleteDB(TABLE, whereFormat.join(" AND "))
        } catch (err) {
            console.log("Unable to delete");
        }

    }
}