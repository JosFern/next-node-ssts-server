import { company } from "../src/modules/company";
import { employer } from "../src/modules/employer";
import { employers } from "../_data_/employers";
import { v4 as uuidv4 } from 'uuid';
import { each, map } from "lodash";
import { store } from "../src/modules/store";

test("new employer model", () => {
    const comp = new company(undefined, "Lemondrop", 6, 30)

    const employerID = uuidv4()

    const model = new employer(
        undefined,
        "John",
        "Doe",
        "john@gmail.com",
        "123123123",
        "employer",
        employerID,
        comp.id
    )

    expect(typeof model.accountID).toBe("string")
    expect(model.getFirstName()).toBe("John")
    expect(model.getLastName()).toBe("Doe")
    expect(model.getEmail()).toBe("john@gmail.com")
    expect(model.employerID).toBe(employerID)
    expect(model.companyID).toBe(comp.id)
})

test("new employer list", () => {

    const comp = new company(undefined, "Lemondrop", 6, 30)

    const models = map(employers, (data) => new employer(
        undefined,
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        "employer",
        undefined,
        comp.id
    ))

    each(employers, (data, index) => {
        expect(typeof models[index].accountID).toBe("string")
        expect(models[index].getFirstName()).toBe(data.firstname)
        expect(models[index].getLastName()).toBe(data.lastname)
        expect(models[index].getEmail()).toBe(data.email)
        expect(models[index].role).toBe("employer")
        expect(models[index].getPassword()).toBe(data.password)
        expect(typeof models[index].employerID).toBe("string")
        expect(typeof models[index].companyID).toBe("string")
    })
})

test("update employer", () => {

    const compid = uuidv4()

    const comp = new company(compid, "Lemondrop", 6, 30)


    const model = new employer(
        undefined,
        "John",
        "Doe",
        "john@gmail.com",
        "123123123",
        "employer",
        undefined,
        comp.id
    )

    model.updateAccount({
        firstname: "Johnny",
        lastname: "Does",
        email: "johnny@gmail.com",
        password: "johnny123"
    })

    const newCompID = uuidv4()

    model.updateEmployerCompany(newCompID)

    expect(model.getFirstName()).toBe("Johnny")
    expect(model.getLastName()).toBe("Does")
    expect(model.getEmail()).toBe("johnny@gmail.com")
    expect(model.getPassword()).toBe("johnny123")
    expect(model.companyID).toBe(newCompID)
})


test("get associated company", () => {

    const compid = uuidv4()

    const comp = new company(compid, "Lemondrop", 6, 30)

    store.postCompany({
        companyID: compid,
        name: "Lemondrop",
        allotedleaves: 6,
        overtimelimit: 30
    })

    const model = new employer(
        undefined,
        "John",
        "Doe",
        "john@gmail.com",
        "123123123",
        "employer",
        undefined,
        comp.id
    )

    const assocCompany = model.getAssocCompany()

    expect(assocCompany.id).toBe(model.companyID)
})