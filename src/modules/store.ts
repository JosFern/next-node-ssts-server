import _ from "lodash"
import { account } from "./account"
import { admin } from "./admin"
import { company } from "./company"
import { employee } from "./employee"
import { employer } from "./employer"

export class store {
    private static employees: employee[] = []
    private static accounts: account[] = []
    private static employers: employer[] = []
    private static admins: admin[] = []
    private static companies: company[] = []

    static getCompanies = () => store.companies

    static getCompany = (id: string) => _.find(store.companies, { id })

    static getEmployees = () => store.employees

    static getAccounts = () => store.accounts

    static getAccount = (id: string) => _.find(store.accounts, { accountID: id })

    static getAdmins = () => store.admins

    static getEmployers = () => store.employers

    static getEmployer = (id: string) => {

        const emp = _.find(store.employers, { employerID: id })

        const acc = _.find(store.accounts, { accountID: emp?.accountID })

        return { ...emp, ...acc }

    }

    static getEmployee = (id: string) => {

        const emp = _.find(store.employees, { employeeID: id })

        const acc = _.find(store.accounts, { accountID: emp?.accountID })

        return { ...emp, ...acc }
    }


    static postCompany = (compInfo: object | any) => {

        const { companyID, name, allotedleaves, overtimelimit } = compInfo

        const newCompany = new company(companyID, name, allotedleaves, overtimelimit)

        store.companies.push(newCompany)
    }

    static putCompany = (compInfo: object | any) => {

        const { id, name, allotedleaves, overtimelimit } = compInfo

        const index = _.findIndex(store.companies, { id })

        store.companies[index].updateCompany(name, allotedleaves, overtimelimit)

    }

    // static postEmployer = (emplyr: object | any) => {

    //     const { employerID, accountID, companyID } = emplyr

    //     const newEmployer = new employer(employerID, accountID, companyID)

    //     store.employers.push(newEmployer)
    // }

    static postAccount = (acc: object | any) => {

        const { accountID, firstname, lastname, email, password, role } = acc

        const newAccount = new account(accountID, firstname, lastname, email, password, role)

        store.accounts.push(newAccount)
    }

    static putEmployer = (emplyr: object | any) => {

        const { id, firstname, lastname, email, companyID, password } = emplyr

        const emp: employer | any = _.find(store.employers, { employerID: id })

        emp?.updateCompany(companyID)

        const accIndex = _.findIndex(store.accounts, { accountID: emp.accountID })

        // store.accounts[accIndex].updateAccount({ firstname, lastname, email, password })

    }

    // static postEmployee = (emp: object | any) => {

    //     const { employeeID, accountID, companyID, salaryperhour, employmenttype, position } = emp

    //     const newEmployee = new employee(
    //         employeeID,
    //         accountID,
    //         salaryperhour,
    //         employmenttype,
    //         companyID,
    //         position
    //     )

    //     store.employees.push(newEmployee)
    // }

    static putEmployee = (emp: object | any) => {

        const {
            id,
            firstname,
            lastname,
            email,
            password,
            salaryperhour,
            employmenttype,
            position } = emp

        const employee: employee | any = _.find(store.employees, { employeeID: id })

        employee?.updateEmployee(salaryperhour, employmenttype, position)

        const accIndex = _.findIndex(store.accounts, { accountID: employee.accountID })

        // store.accounts[accIndex].updateAccount({ firstname, lastname, email, password })
    }

    static postLeave = (leave: object | any) => {

        const { id } = leave

        const emp: employee | any = _.find(store.employees, { employeeID: id })

        emp.requestLeave({ ...leave })
    }

    static getEmployeeLeaves = (id: string) => {

        const index = _.findIndex(store.employees, { employeeID: id })

        return store.employees[index].retrieveLeaves()
    }

}