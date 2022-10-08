import { account } from "./account"
import { admin } from "./admin"
import { company } from "./company"
import { employee } from "./employee"
import { employer } from "./employer"

export class store {
    static employees: employee[] = []
    static accounts: account[] = []
    static employers: employer[] = []
    static admins: admin[] = []
    static companies: company[] = []
}