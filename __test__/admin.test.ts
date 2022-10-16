import { admin } from "../src/modules/admin";
import { account } from "../src/modules/account";
import { v4 as uuidv4 } from 'uuid';
import { selectDB } from "../src/lib/database/query";


test("new admin model", () => {

    const accountID = uuidv4()
    const model = new admin(undefined, accountID)

    expect(typeof model.adminID).toBe("string")
    expect(model.accountID).toBe(accountID)
})

test("adding admin to db and check", async () => {

    const accountID = "qwe-asd-zxc"
    const adminID = "zxc-asd-qwe"

    const adminModel = new admin(adminID, accountID)
    const accountModel = new account(accountID, "Admin", "mindA", "adminSample@gmail.com", "admin123", "admin")

    const isExist = await selectDB('Account', `email='${accountModel.getEmail()}'`)

    if (isExist.length === 0) {
        await adminModel.insertData()
        await accountModel.insertData()
    }

    const adminSelect = await selectDB('Admin', `adminID='${adminID}'`)
    const accountSelect = await selectDB('Account', `accountID='${adminSelect[0].accountID}'`)

    if (adminSelect.length === 0) {
        expect(adminSelect).toStrictEqual([])
    } else {
        expect(typeof adminSelect[0].adminID).toBe("string")
        expect(adminSelect[0].accountID).toBe(accountID)
        expect(accountSelect[0].accountID).toBe(accountID)
        expect(accountSelect[0].firstname).toBe("Admin")
        expect(accountSelect[0].lastname).toBe("mindA")
        expect(accountSelect[0].email).toBe("adminSample@gmail.com")
        expect(accountSelect[0].password).toBe("admin123")
        expect(accountSelect[0].role).toBe("admin")
    }

})

test('update admin account in db and check', async () => {

    const accountID = "qwe-asd-zxc"
    const adminID = "zxc-asd-qwe"

    const accountModel = new account(accountID, "Admin123", "mindA123", "adminSample@gmail.com", "administrator", "admin")

    await accountModel.updateData()

    const adminSelect = await selectDB('Admin', `adminID='${adminID}'`)
    const accountSelect = await selectDB('Account', `accountID='${adminSelect[0].accountID}'`)

    expect(typeof accountSelect[0].accountID).toBe("string")
    expect(accountSelect[0].firstname).toBe("Admin123")
    expect(accountSelect[0].lastname).toBe("mindA123")
    expect(accountSelect[0].email).toBe("adminSample@gmail.com")
    expect(accountSelect[0].password).toBe("administrator")
    expect(accountSelect[0].role).toBe("admin")

    const reModel = new account(accountID, "Admin", "mindA", "adminSample@gmail.com", "admin123", "admin")
    await reModel.updateData() // get back to its original value from insert admin test
})

test('delete admin data from db and check', async () => {
    const accountID = "qwe-asd-zxc"
    const adminID = "zxc-asd-qwe"

    const adminModel = new admin(adminID, accountID)
    const accountModel = new account(accountID, "Admin", "mindA", "adminSample@gmail.com", "admin123", "admin")

    await adminModel.deleteData()
    await accountModel.deleteData()

    const isAdminExist = await selectDB('Admin', `adminID='${adminID}'`)
    const isAccountExist = await selectDB('Account', `accountID='${accountID}'`)

    expect(isAdminExist).toStrictEqual([])
    expect(isAccountExist).toStrictEqual([])
})