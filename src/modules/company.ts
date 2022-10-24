import { find, map } from 'lodash';
import { selectDB } from '../lib/database/query';
import { v4 as uuidv4 } from 'uuid';
import { account } from './account';
import { dbOperations } from './dbOperations';
import { employee } from './employee';
import { employer } from './employer';

export class company extends dbOperations {
    public readonly id: string;
    private name: string;
    private allotedleaves: number;
    private overtimelimit: number;
    private readonly TABLE = 'Company'

    constructor(id: string | undefined, name: string, allotedleaves: number, overtimelimit: number) {
        super()
        this.id = (id === undefined) ? uuidv4() : id
        this.name = name
        this.allotedleaves = allotedleaves
        this.overtimelimit = overtimelimit

        this.assignData({
            id: this.id,
            name: this.name,
            allocateLeaves: this.allotedleaves,
            allocateOvertime: this.overtimelimit,
            TABLE: this.TABLE
        })
    }

    getName = () => this.name

    getAllotedLeaves = () => this.allotedleaves

    getOvertimeLimit = () => this.overtimelimit

    deleteAssociates = async () => {
        const employers = await selectDB('Employer', `companyID='${this.id}'`)
        const employees = await selectDB('Employee', `companyID='${this.id}'`)
        const accounts = await selectDB('Account')

        map(employers, async (emp: any) => {
            const accInfo: any = find(accounts, { accountID: emp.accountID })

            const employerModel = new employer(
                emp.employerID,
                emp.accountID,
                emp.companyID
            )
            const accountModel = new account(
                accInfo.accountID,
                accInfo.firstname,
                accInfo.lastname,
                accInfo.email,
                accInfo.password,
                "employer"
            )

            await employerModel.deleteData()

            await accountModel.deleteData()
        })

        map(employees, async (emp: any) => {
            const accInfo: any = find(accounts, { accountID: emp.accountID })
            const employeeModel = new employee(
                emp.id,
                emp.accountID,
                emp.rate,
                emp.empType,
                emp.companyID,
                emp.pos
            )

            const accountModel = new account(
                accInfo.accountID,
                accInfo.firstname,
                accInfo.lastname,
                accInfo.email,
                accInfo.password,
                "employee"
            )

            await employeeModel.deleteEmployeeRecords()

            await employeeModel.deleteData()

            await accountModel.deleteData()
        })

    }
}