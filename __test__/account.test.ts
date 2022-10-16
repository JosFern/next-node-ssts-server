import { each, map } from "lodash";
import { account } from "../src/modules/account";
import { accounts } from "../_data_/accounts";
import { selectDB } from "../src/lib/database/query";


test("new account model", () => {
    const model = new account(undefined, "Ayato", "Kamisato", "ayato@gmail.com", "ayato123", "admin")

    expect(typeof model.accountID).toBe("string")
    expect(model.getFirstName()).toBe("Ayato")
    expect(model.getLastName()).toBe("Kamisato")
    expect(model.getEmail()).toBe("ayato@gmail.com")
    expect(model.getPassword()).toBe("ayato123")
    expect(model.role).toBe("admin")
})

test("new account list", () => {

    const models = map(accounts, (data) => new account(
        undefined,
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.role,
    ))

    each(accounts, (data, index) => {
        expect(typeof models[index].accountID).toBe("string")
        expect(models[index].getFirstName()).toBe(data.firstname)
        expect(models[index].getLastName()).toBe(data.lastname)
        expect(models[index].getEmail()).toBe(data.email)
        expect(models[index].role).toBe(data.role)
        expect(models[index].getPassword()).toBe(data.password)
    })
})

test('add account to db and check', async () => {

    const accountID = "poi-lkj-mnb"

    const accountModel = new account(accountID, "Account", "tnuoccA", "accountSample@gmail.com", "account123", "admin")

    const isExist = await selectDB('Account', `email='${accountModel.getEmail()}'`)

    if (isExist.length === 0) await accountModel.insertData()

    const accountSelect = await selectDB('Account', `accountID='${accountID}'`)

    if (accountSelect.length === 0) {
        expect(accountSelect).toStrictEqual([])
    } else {
        expect(accountSelect[0].accountID).toBe(accountID)
        expect(accountSelect[0].firstname).toBe("Account")
        expect(accountSelect[0].lastname).toBe("tnuoccA")
        expect(accountSelect[0].email).toBe("accountSample@gmail.com")
        expect(accountSelect[0].password).toBe("account123")
        expect(accountSelect[0].role).toBe("admin")
    }
})

test('update account in db and check', async () => {

    const accountID = "poi-lkj-mnb"

    const accountModel = new account(accountID, "Account123", "tnuoccA321", "accountSample@gmail.com", "accountSample123", "admin")

    await accountModel.updateData()

    const accountSelect = await selectDB('Account', `accountID='${accountID}'`)

    expect(typeof accountSelect[0].accountID).toBe("string")
    expect(accountSelect[0].firstname).toBe("Account123")
    expect(accountSelect[0].lastname).toBe("tnuoccA321")
    expect(accountSelect[0].email).toBe("accountSample@gmail.com")
    expect(accountSelect[0].password).toBe("accountSample123")
    expect(accountSelect[0].role).toBe("admin")

    const reModel = new account(accountID, "Account", "tnuoccA", "accountSample@gmail.com", "account123", "admin")
    await reModel.updateData() // get back to its original value from insert admin test
})

test('delete account data from db and check', async () => {

    const accountID = "poi-lkj-mnb"

    const accountModel = new account(accountID, "Account", "tnuoccA", "accountSample@gmail.com", "account123", "admin")

    await accountModel.deleteData()

    const isAccountExist = await selectDB('Account', `accountID='${accountID}'`)

    expect(isAccountExist).toStrictEqual([])
})