import { each, map } from "lodash";
import { selectDB } from "../src/lib/database/query";
import { company } from "../src/modules/company";
import { companies } from "../_data_/companies";

test("new company model", () => {
    const model = new company(undefined, "Lemondrop", 6, 30)

    expect(typeof model.id).toBe("string")
    expect(model.getName()).toBe("Lemondrop")
    expect(model.getAllotedLeaves()).toBe(6)
    expect(model.getOvertimeLimit()).toBe(30)
})

test('new company list', () => {

    const models = map(companies, (data) => new company(undefined, data.name, data.allotedleaves, data.overtimelimit))

    each(companies, (data, index) => {
        expect(models[index].getName()).toBe(data.name)
        expect(models[index].getAllotedLeaves()).toBe(data.allotedleaves)
        expect(models[index].getOvertimeLimit()).toBe(data.overtimelimit)
    })
})

test('insert company to db and check if exist', async () => {

    const id = '123-456-789'
    const model = new company(id, "company1", 1, 5)

    const isExist = await selectDB("Company", `id='${id}'`)

    if (isExist.length === 0) await model.insertData()

    const comp = await selectDB("Company", `id='${id}'`)

    expect(typeof comp[0].id).toBe("string")
    expect(comp[0].name).toBe("company1")
    expect(comp[0].allocateLeaves).toBe(1)
    expect(comp[0].allocateOvertime).toBe(5)

})

test('update company in db and check if updated', async () => {
    const id = '123-456-789'
    const model = new company(id, "company1", 6, 30)

    await model.updateData()

    const comp = await selectDB("Company", `id='${id}'`)

    expect(comp[0].id).toBe(id)
    expect(comp[0].name).toBe("company1")
    expect(comp[0].allocateLeaves).toBe(6)
    expect(comp[0].allocateOvertime).toBe(30)

    const reModel = new company(id, "company1", 1, 5)
    await reModel.updateData() // get back to its original value from insert company test
})

test('delete company from db then check', async () => {

    const id = '123-456-789'
    const model = new company(id, "company1", 1, 5)

    await model.deleteData()

    const statement = `id='${id}'`

    const isExist = await selectDB('Company', statement)

    expect(isExist).toStrictEqual([])
})
