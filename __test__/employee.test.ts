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

//-----------------------------GENERATE DAILY WAGE TEST----------------------

test('check employee daily wage', async () => {
    const accountID = "account-dailywage-123456"
    const employeeID = "employee-dailywage-123456"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")

    const isExist = await selectDB('Employee', `employeeID='${employeeID}'`)

    if (isExist.length === 0) await employeeModel.insertData()

    const dailyWage = employeeModel.getDailyWage()

    expect(dailyWage).toBe(12)

    await employeeModel.deleteData()

})

//-----------------------------GENERATE REMAINING LEAVES TEST----------------------

test('request leave and check remaining leave', async () => {
    const accountID = "account-leave-123456"
    const employeeID = "employee-leave-123456"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")
    const accountModel = new account(accountID, "Employee", "eeyolpmE", "employeeLeave@gmail.com", "employee123", "employee")

    const isExist = await selectDB('Account', `email='${accountModel.getEmail()}'`)

    if (isExist.length === 0) {
        await employeeModel.insertData()
        await accountModel.insertData()
    }

    const leaveID = 'leave-123456'
    const leaveModel = new leave(leaveID, "2022-10-05T14:00:00+08:00", "2022-10-08T14:00:00+08:00", "emergency", true, employeeID)

    const leaveIDExist = await selectDB('Leave', `id='${leaveID}'`)

    if (leaveIDExist.length === 0) {
        await leaveModel.insertData()
    }

    const remainingLeaves = await employeeModel.getRemainingLeaves()

    expect(remainingLeaves).toBe(2)

    await leaveModel.deleteData()
    await employeeModel.deleteData()
    await accountModel.deleteData()

})

//-----------------------------GENERATE TOTAL OVERTIMES TEST----------------------

test('request overtime and check total overtimes', async () => {
    const accountID = "account-ot-123456"
    const employeeID = "employee-ot-123456"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")
    const accountModel = new account(accountID, "Employee", "eeyolpmE", "employeeOvertime@gmail.com", "employee123", "employee")

    const isExist = await selectDB('Account', `email='${accountModel.getEmail()}'`)

    if (isExist.length === 0) {
        await employeeModel.insertData()
        await accountModel.insertData()
    }

    const otID = 'ot-123456'
    const otModel = new overtime(otID, "2022-10-09T14:00:00+08:00", "2022-10-09T14:00:00+08:00", "2022-10-09T18:00:00+08:00", "maintenance", true, employeeID)

    const otIDExist = await selectDB('Overtime', `id='${otID}'`)

    if (otIDExist.length === 0) {
        await otModel.insertData()
    }

    const totalOvertimes = await employeeModel.getTotalOvertime()

    expect(totalOvertimes).toBe(4)

    await otModel.deleteData()
    await employeeModel.deleteData()
    await accountModel.deleteData()

})

//-----------------------------GENERATE TOTAL ABSENCES TEST----------------------

test('set employee absence and check total absences', async () => {
    const accountID = "account-monthlySal-123456"
    const employeeID = "employee-monthlySal-123456"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")

    const isExist = await selectDB('Employee', `employeeID='${employeeID}'`)

    if (isExist.length === 0) await employeeModel.insertData()

    const absenceID = 'absence-123456'
    const absenceModel = new absence(absenceID, "2022-10-26T14:00:00+08:00", "2022-10-27T14:00:00+08:00", employeeID)

    const absenceIDExist = await selectDB('Absence', `id='${absenceID}'`)

    if (absenceIDExist.length === 0) {
        await absenceModel.insertData()
    }

    const totalAbsences = await employeeModel.getTotalAbsences()

    expect(totalAbsences).toBe(2)

    await absenceModel.deleteData()
    await employeeModel.deleteData()

})

//-----------------------------GENERATE MONTHLY SALARY TEST----------------------

test('set employee absence and check total absences', async () => {
    const accountID = "account-monthlySal-123456"
    const employeeID = "employee-monthlySal-123456"
    const companyID = '07ccb2ce-b318-4de4-bc53-45d14b2617fd' //workbean company data

    const employeeModel = new employee(employeeID, accountID, 3, "parttime", companyID, "developer")

    const isExist = await selectDB('Employee', `employeeID='${employeeID}'`)

    if (isExist.length === 0) await employeeModel.insertData()


    //---------------------DAILY WAGE-----------------------
    const dailyWage = employeeModel.getDailyWage()
    //-------------------------------------------------------

    //---------------------ADD LEAVES-----------------------
    const leaveID = 'add-leave-123456'
    const leaveModel = new leave(leaveID, "2022-10-05T14:00:00+08:00", "2022-10-08T14:00:00+08:00", "emergency", true, employeeID)

    const leaveIDExist = await selectDB('Leave', `id='${leaveID}'`)

    if (leaveIDExist.length === 0) {
        await leaveModel.insertData()
    }

    const remainingLeaves = await employeeModel.getRemainingLeaves()
    //-------------------------------------------------------

    //---------------------ADD ABSENCE-----------------------
    const otID = 'add-ot-123456'
    const otModel = new overtime(otID, "2022-10-09T14:00:00+08:00", "2022-10-09T14:00:00+08:00", "2022-10-09T18:00:00+08:00", "maintenance", true, employeeID)

    const otIDExist = await selectDB('Overtime', `id='${otID}'`)

    if (otIDExist.length === 0) {
        await otModel.insertData()
    }

    const totalOvertimes = await employeeModel.getTotalOvertime()
    //-------------------------------------------------------


    //---------------------ADD ABSENCE-----------------------
    const absenceID = 'add-absence-123456'
    const absenceModel = new absence(absenceID, "2022-10-26T14:00:00+08:00", "2022-10-27T14:00:00+08:00", employeeID)

    const absenceIDExist = await selectDB('Absence', `id='${absenceID}'`)

    if (absenceIDExist.length === 0) {
        await absenceModel.insertData()
    }

    const totalAbsences = await employeeModel.getTotalAbsences()
    //-------------------------------------------------------


    const monthlySalary = await employeeModel.getMonthlySalary()

    expect(dailyWage).toBe(12)
    expect(remainingLeaves).toBe(2)
    expect(totalOvertimes).toBe(4)
    expect(totalAbsences).toBe(2)
    expect(monthlySalary).toBe(245)

    await employeeModel.deleteData()
    await leaveModel.deleteData()
    await otModel.deleteData()
    await absenceModel.deleteData()

})