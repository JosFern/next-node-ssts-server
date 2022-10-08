import { v4 as uuidv4 } from 'uuid';

export class admin {
    private readonly adminID: string

    constructor(adminID: string) {
        this.adminID = adminID === undefined ? uuidv4() : adminID
    }
}