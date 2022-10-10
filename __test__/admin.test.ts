import { each, map } from "lodash";
import { store } from "../src/modules/store";
import { admin } from "../src/modules/admin";
import { admins } from "../_data_/admin";


test("new admin model", () => {
    const model = new admin(undefined, "Admin", "Admin", "admin@gmail.com", "admin123", "admin", undefined)

    expect(typeof model.accountID).toBe("string")
    expect(model.getFirstName()).toBe("Admin")
    expect(model.getLastName()).toBe("Admin")
    expect(model.getEmail()).toBe("admin@gmail.com")
    expect(model.getPassword()).toBe("admin123")
    expect(model.role).toBe("admin")
    expect(typeof model.adminID).toBe("string")
})

test("new admin list", () => {

    const models = map(admins, (data) => new admin(
        undefined,
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        "admin",
        undefined,
    ))

    each(admins, (data, index) => {
        expect(typeof models[index].accountID).toBe("string")
        expect(models[index].getFirstName()).toBe(data.firstname)
        expect(models[index].getLastName()).toBe(data.lastname)
        expect(models[index].getEmail()).toBe(data.email)
        expect(models[index].role).toBe("admin")
        expect(models[index].getPassword()).toBe(data.password)
        expect(typeof models[index].adminID).toBe("string")
    })
})

test("update admin account", () => {

    const model = new admin(
        undefined,
        "John",
        "Doe",
        "john@gmail.com",
        "123123123",
        "admin",
        undefined,
    )

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
})