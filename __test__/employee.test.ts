import { company } from "../src/modules/company";
import { v4 as uuidv4 } from 'uuid';
import { each, map } from "lodash";
import { store } from "../src/modules/store";
import { employee } from "../src/modules/employee";
import { employees } from "../_data_/employees";
import { leave } from "../src/modules/leaves";
import { absences } from "../_data_/absences";
import { leaves } from "../_data_/leave";
import { absence } from "../src/modules/absences";
import { overtimes } from "../_data_/overtime";
import { overtime } from "../src/modules/overtime";

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

test("get associated company", () => {

    const compid = uuidv4()

    const comp = new company(compid, "Lemondrop", 6, 30)

    store.postCompany({
        companyID: compid,
        name: "Lemondrop",
        allotedleaves: 6,
        overtimelimit: 30
    })

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", comp.id, "developer")

    const assocCompany = model.getAssocCompany()

    expect(assocCompany.id).toBe(model.companyID)
})

test("update employee", () => {

    const compid = uuidv4()

    const comp = new company(compid, "Lemondrop", 6, 30)

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", comp.id, "developer")

    model.updateAccount({
        firstname: "Johnny",
        lastname: "Does",
        email: "johnny@gmail.com",
        password: "johnny123"
    })

    expect(model.getFirstName()).toBe("Johnny")
    expect(model.getLastName()).toBe("Does")
    expect(model.getEmail()).toBe("johnny@gmail.com")
    expect(model.getPassword()).toBe("johnny123")
    expect(model.companyID).toBe(compid)
})

//--------------------------------COMPUTATIONS TESTS--------------------------


//-----------------------------GENERATE DAILY WAGE TEST----------------------

test("generate daily wage", () => {

    const comp = new company(undefined, "Lemondrop", 6, 30)

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", comp.id, "developer")

    expect(model.getDailyWage()).toBe(12)
})

//-----------------------------GENERATE REMAINING LEAVES TEST----------------------

test("generate remaining leaves", () => {

    const compid = uuidv4()

    store.postCompany({
        companyID: compid,
        name: "Lemondrop",
        allotedleaves: 6,
        overtimelimit: 30
    })

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

    each(leaves, (data) => {
        const lv = new leave(data.datestart, data.dateend, data.reason, data.approved)
        model.postLeave(lv)
    })

    //expect 1 total leaves remaining

    expect(model.getRemainingLeaves()).toBe(1)
})

//-----------------------------GENERATE TOTAL ABSENCES TEST----------------------

test("generate total absences", () => {

    const compid = uuidv4()

    store.postCompany({
        companyID: compid,
        name: "Lemondrop",
        allotedleaves: 6,
        overtimelimit: 30
    })

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

    each(absences, (data) => {
        const abs = new absence(data.datestart, data.dateend)
        model.postAbsence(abs)
    })

    //expect 4 total absences

    expect(model.getTotalAbsences()).toBe(4)
})

//-----------------------------GENERATE TOTAL OVERTIMES TEST----------------------

test("generate total overtime", () => {
    const compid = uuidv4()

    store.postCompany({
        companyID: compid,
        name: "Lemondrop",
        allotedleaves: 6,
        overtimelimit: 30
    })

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

    each(overtimes, (data) => {
        const ot = new overtime(
            data.datehappen,
            data.timestart,
            data.timeend,
            data.reason,
            data.approved
        )
        model.postOvertime(ot)
    })

    //expect 8 total ot hours

    expect(model.getTotalOvertime()).toBe(8)
})

//-----------------------------GENERATE MONTHLY SALARY TEST----------------------

test("generate monthly salary", () => {
    const compid = uuidv4()

    store.postCompany({
        companyID: compid,
        name: "Lemondrop",
        allotedleaves: 6,
        overtimelimit: 30
    })

    const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

    each(leaves, (data) => {
        const lv = new leave(data.datestart, data.dateend, data.reason, data.approved)
        model.postLeave(lv)
    })


    each(absences, (data) => {
        const abs = new absence(data.datestart, data.dateend)
        model.postAbsence(abs)
    })

    each(overtimes, (data) => {
        const ot = new overtime(
            data.datehappen,
            data.timestart,
            data.timeend,
            data.reason,
            data.approved
        )
        model.postOvertime(ot)
    })

    //expect monthly salary of 213

    expect(model.getMonthlySalary()).toBe(213)

})