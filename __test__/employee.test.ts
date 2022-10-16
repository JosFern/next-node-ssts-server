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
import { account } from "../src/modules/account";
import { selectDB } from "../src/lib/database/query";

test("new employee model", () => {

    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const accountID = uuidv4()

    const model = new employee(undefined, accountID, 3, "parttime", companyID, "developer")

    expect(typeof model.employeeID).toBe("string")
    expect(model.accountID).toBe(accountID)
    expect(model.getRate()).toBe(3)
    expect(model.getType()).toBe("parttime")
    expect(model.companyID).toBe(companyID)
    expect(model.getPosition()).toBe("developer")
})

test("adding employee to db and check", async () => {

    const accountID = "acco-unt1-2345"
    const employeeID = "empl-oyee-1234"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")
    const accountModel = new account(accountID, "Employee", "eeyolpmE", "employeeSample@gmail.com", "employee123", "employee")

    const isExist = await selectDB('Account', `email='${accountModel.getEmail()}'`)

    if (isExist.length === 0) {
        await employeeModel.insertData()
        await accountModel.insertData()
    }

    const empSelect = await selectDB('Employee', `employeeID='${employeeID}'`)
    const accountSelect = await selectDB('Account', `accountID='${empSelect[0].accountID}'`)

    if (empSelect.length === 0) {
        expect(empSelect).toStrictEqual([])
    } else {
        expect(typeof empSelect[0].employeeID).toBe("string")
        expect(empSelect[0].accountID).toBe(accountID)
        expect(empSelect[0].companyID).toBe(companyID)
        expect(empSelect[0].rate).toBe(3)
        expect(empSelect[0].pos).toBe("developer")
        expect(empSelect[0].empType).toBe("parttime")
        expect(accountSelect[0].accountID).toBe(accountID)
        expect(accountSelect[0].firstname).toBe("Employee")
        expect(accountSelect[0].lastname).toBe("eeyolpmE")
        expect(accountSelect[0].email).toBe("employeeSample@gmail.com")
        expect(accountSelect[0].password).toBe("employee123")
        expect(accountSelect[0].role).toBe("employee")
    }

})

test('update employee account in db and check', async () => {

    const accountID = "acco-unt1-2345"
    const employeeID = "empl-oyee-1234"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 20, "fulltime", companyID, "software engineer")
    const accountModel = new account(accountID, "Employee123", "eeyolpmE321", "employeeSample@gmail.com", "emp321", "employee")

    employeeModel.updateData()
    await accountModel.updateData()

    const empSelect = await selectDB('Employee', `employeeID='${employeeID}'`)
    const accountSelect = await selectDB('Account', `accountID='${empSelect[0].accountID}'`)

    expect(typeof empSelect[0].employeeID).toBe("string")
    expect(empSelect[0].accountID).toBe(accountID)
    expect(empSelect[0].companyID).toBe(companyID)
    expect(empSelect[0].rate).toBe(20)
    expect(empSelect[0].pos).toBe("software engineer")
    expect(empSelect[0].empType).toBe("fulltime")
    expect(accountSelect[0].accountID).toBe(accountID)
    expect(accountSelect[0].firstname).toBe("Employee123")
    expect(accountSelect[0].lastname).toBe("eeyolpmE321")
    expect(accountSelect[0].email).toBe("employeeSample@gmail.com")
    expect(accountSelect[0].password).toBe("emp321")
    expect(accountSelect[0].role).toBe("employee")

    const employeeReModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")
    const accountReModel = new account(accountID, "Employee", "eeyolpmE", "employeeSample@gmail.com", "employee123", "employee")
    await employeeReModel.updateData() // get back to its original value from insert employee test
    await accountReModel.updateData()
})

test('delete employee data from db and check', async () => {

    const accountID = "acco-unt1-2345"
    const employeeID = "empl-oyee-1234"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")
    const accountModel = new account(accountID, "Employee", "eeyolpmE", "employeeSample@gmail.com", "employee123", "employee")

    await employeeModel.deleteData()
    await accountModel.deleteData()

    const isEmployeeExist = await selectDB('Employee', `employeeID='${employeeID}'`)
    const isAccountExist = await selectDB('Account', `accountID='${accountID}'`)

    expect(isEmployeeExist).toStrictEqual([])
    expect(isAccountExist).toStrictEqual([])
})

//--------------------------------COMPUTATIONS TESTS--------------------------


// //-----------------------------GENERATE DAILY WAGE TEST----------------------

// test("generate daily wage", () => {

//     const comp = new company(undefined, "Lemondrop", 6, 30)

//     const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", comp.id, "developer")

//     expect(model.getDailyWage()).toBe(12)
// })

// //-----------------------------GENERATE REMAINING LEAVES TEST----------------------

// test("generate remaining leaves", () => {

//     const compid = uuidv4()

//     store.postCompany({
//         companyID: compid,
//         name: "Lemondrop",
//         allotedleaves: 6,
//         overtimelimit: 30
//     })

//     const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

//     each(leaves, (data) => {
//         const lv = new leave(data.datestart, data.dateend, data.reason, data.approved)
//         model.postLeave(lv)
//     })

//     //expect 1 total leaves remaining

//     expect(model.getRemainingLeaves()).toBe(1)
// })

// //-----------------------------GENERATE TOTAL ABSENCES TEST----------------------

// test("generate total absences", () => {

//     const compid = uuidv4()

//     store.postCompany({
//         companyID: compid,
//         name: "Lemondrop",
//         allotedleaves: 6,
//         overtimelimit: 30
//     })

//     const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

//     each(absences, (data) => {
//         const abs = new absence(data.datestart, data.dateend)
//         model.postAbsence(abs)
//     })

//     //expect 4 total absences

//     expect(model.getTotalAbsences()).toBe(4)
// })

// //-----------------------------GENERATE TOTAL OVERTIMES TEST----------------------

// test("generate total overtime", () => {
//     const compid = uuidv4()

//     store.postCompany({
//         companyID: compid,
//         name: "Lemondrop",
//         allotedleaves: 6,
//         overtimelimit: 30
//     })

//     const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

//     each(overtimes, (data) => {
//         const ot = new overtime(
//             data.datehappen,
//             data.timestart,
//             data.timeend,
//             data.reason,
//             data.approved
//         )
//         model.postOvertime(ot)
//     })

//     //expect 8 total ot hours

//     expect(model.getTotalOvertime()).toBe(8)
// })

// //-----------------------------GENERATE MONTHLY SALARY TEST----------------------

// test("generate monthly salary", () => {
//     const compid = uuidv4()

//     store.postCompany({
//         companyID: compid,
//         name: "Lemondrop",
//         allotedleaves: 6,
//         overtimelimit: 30
//     })

//     const model = new employee(undefined, "Jose", "Baisac", "jose@gmail.com", "123123123", "employee", undefined, 3, "parttime", compid, "developer")

//     each(leaves, (data) => {
//         const lv = new leave(data.datestart, data.dateend, data.reason, data.approved)
//         model.postLeave(lv)
//     })


//     each(absences, (data) => {
//         const abs = new absence(data.datestart, data.dateend)
//         model.postAbsence(abs)
//     })

//     each(overtimes, (data) => {
//         const ot = new overtime(
//             data.datehappen,
//             data.timestart,
//             data.timeend,
//             data.reason,
//             data.approved
//         )
//         model.postOvertime(ot)
//     })

//     //expect monthly salary of 213

//     expect(model.getMonthlySalary()).toBe(213)

// })