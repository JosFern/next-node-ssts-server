import { createServer, IncomingMessage, ServerResponse, } from "http";
import { absenceRequest } from "./api/absences";
import { companyRequest } from "./api/company";
import { dailywageRequest } from "./api/dailywage";
import { employeeRequest } from "./api/employee";
import { employerRequest } from "./api/employer";
import { leaveRequest } from "./api/leave";
import { monthlySalRequest } from "./api/monthlysalary";
import { overtimeRequest } from "./api/overtime";
import { accountRequest } from "./api/profile";
import { remainingleave } from "./api/ramainingleaves";
import { totalAbsencesRequest } from "./api/totalabsences";
import { totalOTRequest } from "./api/totalovertimes";

interface returnMessage {
    code: number
    message: string | any
}

const listener = async (req: IncomingMessage, res: ServerResponse) => {
    try {

        let result: returnMessage | any = { code: 200, message: "success" }

        if ((req.url as string).match('/company(.*?)')) {

            result = await companyRequest(req) as string | object
            console.log(JSON.stringify(result));

        }
        else if ((req.url as string).match('/employer(.*?)')) {

            result = await employerRequest(req) as string | object
            console.log(JSON.stringify(result));

        }
        else if ((req.url as string).match('/employee/leave(.*?)')) {

            result = await leaveRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/overtime(.*?)')) {

            result = await overtimeRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/absence(.*?)')) {

            result = await absenceRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/dailywage(.*?)')) {

            result = await dailywageRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/remainingleave(.*?)')) {

            result = await remainingleave(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/totalovertimes(.*?)')) {

            result = await totalOTRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/totalabsences(.*?)')) {

            result = await totalAbsencesRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/monthlysalary(.*?)')) {

            result = await monthlySalRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee(.*?)')) {

            result = await employeeRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/profile(.*?)')) {

            result = await accountRequest(req) as string | object
            console.log(JSON.stringify(result));
        }

        res.writeHead(result.code, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result.message))

    } catch (error) {
        console.log(error);

    }


}

const server = createServer(listener)
server.listen(8080)