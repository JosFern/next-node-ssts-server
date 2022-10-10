import { company } from "../src/modules/company";
import { v4 as uuidv4 } from 'uuid';
import { each, map } from "lodash";
import { store } from "../src/modules/store";
import { employee } from "../src/modules/employee";
import { employees } from "../_data_/employees";

test("new employee model", () => {
    const comp = new company(undefined, "Lemondrop", 6, 30)

    const employeeID = uuidv4()

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", employeeID, 3, "parttime", comp.id, "developer")

    expect(typeof model.accountID).toBe("string")
    expect(model.getFirstName()).toBe("Jose")
    expect(model.getLastName()).toBe("Baisac")
    expect(model.getEmail()).toBe("jose@gmail.com")
    expect(model.getPassword()).toBe("123123123")
    expect(model.role).toBe("employee")
    expect(model.employeeID).toBe(employeeID)
    expect(model.getSalaryPerHour()).toBe(3)
    expect(model.getEmploymentType()).toBe("parttime")
    expect(model.companyID).toBe(comp.id)
    expect(model.getPosition()).toBe("developer")
})

test("new employee list", () => {

    const comp = new company(undefined, "Lemondrop", 6, 30)

    const models = map(employees, (data) => new employee(
        undefined,
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        "employee",
        undefined,
        data.salaryperhour,
        data.employmenttype,
        comp.id,
        data.position
    ))

    each(employees, (data, index) => {
        expect(typeof models[index].accountID).toBe("string")
        expect(models[index].getFirstName()).toBe(data.firstname)
        expect(models[index].getLastName()).toBe(data.lastname)
        expect(models[index].getEmail()).toBe(data.email)
        expect(models[index].role).toBe("employee")
        expect(models[index].getPassword()).toBe(data.password)
        expect(typeof models[index].employeeID).toBe("string")
        expect(models[index].getSalaryPerHour()).toBe(data.salaryperhour)
        expect(models[index].getEmploymentType()).toBe(data.employmenttype)
        expect(typeof models[index].companyID).toBe("string")
        expect(models[index].getPosition()).toBe(data.position)
    })
})

// test("update employer", () => {

//     const compid = uuidv4()

//     const comp = new company(compid, "Lemondrop", 6, 30)


//     const model = new employee(
//         undefined,
//         "John",
//         "Doe",
//         "john@gmail.com",
//         "123123123",
//         "employer",
//         undefined,
//         comp.id
//     )

//     model.updateAccount({
//         firstname: "Johnny",
//         lastname: "Does",
//         email: "johnny@gmail.com",
//         password: "johnny123"
//     })

//     const newCompID = uuidv4()

//     model.updateEmployerCompany(newCompID)

//     expect(model.getFirstName()).toBe("Johnny")
//     expect(model.getLastName()).toBe("Does")
//     expect(model.getEmail()).toBe("johnny@gmail.com")
//     expect(model.getPassword()).toBe("johnny123")
//     expect(model.companyID).toBe(newCompID)
// })


// test("get associated company", () => {

//     const compid = uuidv4()

//     const comp = new company(compid, "Lemondrop", 6, 30)

//     store.postCompany({
//         companyID: compid,
//         name: "Lemondrop",
//         allotedleaves: 6,
//         overtimelimit: 30
//     })

//     const model = new employer(
//         undefined,
//         "John",
//         "Doe",
//         "john@gmail.com",
//         "123123123",
//         "employer",
//         undefined,
//         comp.id
//     )

//     const assocCompany = model.getAssocCompany()

//     expect(assocCompany.id).toBe(model.companyID)
// })