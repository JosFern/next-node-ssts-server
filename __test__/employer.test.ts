import { company } from "../src/modules/company";
import { employer } from "../src/modules/employer";
import { account } from "../src/modules/account";
import { selectDB } from "../src/lib/database/query";

test("new employer model", () => {

    const companyID = 'c1o2-m3p4-a5n6'
    const comp = new company(companyID, "Test Sample Company", 6, 30)

    const accountID = 'a1c2-c3o4-u5n6'

    const model = new employer(
        undefined,
        accountID,
        comp.id
    )

    expect(typeof model.employerID).toBe("string")
    expect(model.accountID).toBe(accountID)
    expect(model.companyID).toBe(comp.id)
})

test("adding employer to db and check", async () => {

    const accountID = "ac12-co34-un56"
    const employerID = "empl-oyer-1234"
    const companyID = '6def8295-380d-4a27-9ed0-548848a65dce'

    const employerModel = new employer(employerID, accountID, companyID)
    const accountModel = new account(accountID, "Employer", "reyolpmE", "employerSample@gmail.com", "employer123", "employer")

    const isExist = await selectDB('Account', `email='${accountModel.getEmail()}'`)

    if (isExist.length === 0) {
        await employerModel.insertData()
        await accountModel.insertData()
    }

    const empSelect = await selectDB('Employer', `employerID='${employerID}'`)
    const accountSelect = await selectDB('Account', `accountID='${empSelect[0].accountID}'`)

    if (empSelect.length === 0) {
        expect(empSelect).toStrictEqual([])
    } else {
        expect(typeof empSelect[0].employerID).toBe("string")
        expect(empSelect[0].accountID).toBe(accountID)
        expect(empSelect[0].companyID).toBe(companyID)
        expect(accountSelect[0].accountID).toBe(accountID)
        expect(accountSelect[0].firstname).toBe("Employer")
        expect(accountSelect[0].lastname).toBe("reyolpmE")
        expect(accountSelect[0].email).toBe("employerSample@gmail.com")
        expect(accountSelect[0].password).toBe("employer123")
        expect(accountSelect[0].role).toBe("employer")
    }

})

test('update employer account in db and check', async () => {

    const accountID = "ac12-co34-un56"
    const employerID = "empl-oyer-1234"

    const accountModel = new account(accountID, "Employer123", "reyolpmE321", "employerSample@gmail.com", "bossing123", "employer")

    await accountModel.updateData()

    const empSelect = await selectDB('Employer', `employerID='${employerID}'`)
    const accountSelect = await selectDB('Account', `accountID='${empSelect[0].accountID}'`)

    expect(typeof accountSelect[0].accountID).toBe("string")
    expect(accountSelect[0].firstname).toBe("Employer123")
    expect(accountSelect[0].lastname).toBe("reyolpmE321")
    expect(accountSelect[0].email).toBe("employerSample@gmail.com")
    expect(accountSelect[0].password).toBe("bossing123")
    expect(accountSelect[0].role).toBe("employer")

    const reModel = new account(accountID, "Employer", "reyolpmE", "employerSample@gmail.com", "employer123", "employer")
    await reModel.updateData() // get back to its original value from insert employer test
})

test('delete employer data from db and check', async () => {

    const accountID = "ac12-co34-un56"
    const employerID = "empl-oyer-1234"
    const companyID = '6def8295-380d-4a27-9ed0-548848a65dce'

    const employerModel = new employer(employerID, accountID, companyID)
    const accountModel = new account(accountID, "Employer", "reyolpmE", "employerSample@gmail.com", "employer123", "employer")

    await employerModel.deleteData()
    await accountModel.deleteData()

    const isEmployerExist = await selectDB('Employer', `employerID='${employerID}'`)
    const isAccountExist = await selectDB('Account', `accountID='${accountID}'`)

    expect(isEmployerExist).toStrictEqual([])
    expect(isAccountExist).toStrictEqual([])
})