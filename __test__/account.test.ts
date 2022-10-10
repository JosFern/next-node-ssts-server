import { each, map } from "lodash";
import { store } from "../src/modules/store";
import { account } from "../src/modules/account";
import { accounts } from "../_data_/accounts";


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

test("update account account", () => {

    const model = new account(undefined, "Ayato", "Kamisato", "ayato@gmail.com", "ayato123", "admin")

    model.updateAccount({
        firstname: "Ayaka",
        lastname: "Kamisato",
        email: "ayaka@gmail.com",
        password: "ayaka123"
    })

    expect(model.getFirstName()).toBe("Ayaka")
    expect(model.getLastName()).toBe("Kamisato")
    expect(model.getEmail()).toBe("ayaka@gmail.com")
    expect(model.getPassword()).toBe("ayaka123")
})

test("login account retrieve", () => {

    each(accounts, (data) => {
        store.postAccount(data)
    })

    const loginData = { email: "ayato@gmail.com", password: "ayato123" }

    const acc: account | string = store.loginAccount(loginData)

    if (typeof acc === "string") {
        expect(acc).toBe("email and password invalid")
    } else {
        expect(acc.getEmail()).toBe("ayato@gmail.com")
        expect(acc.getPassword()).toBe("ayato123")
    }


})