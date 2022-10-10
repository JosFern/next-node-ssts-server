import { each, map } from "lodash";
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

test("update company", () => {
    const model = new company(undefined, "Lemondrop", 6, 30)

    model.updateCompany("Workbean", 5, 25)

    expect(model.getName()).toBe("Workbean")
    expect(model.getAllotedLeaves()).toBe(5)
    expect(model.getOvertimeLimit()).toBe(25)
})
