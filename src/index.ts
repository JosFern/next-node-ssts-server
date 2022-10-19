import { createServer, IncomingMessage, ServerResponse, } from "http";
import { absenceRequest } from "./api/absences";
import { companyRequest } from "./api/company";
import { dailywageRequest } from "./api/dailywage";
import { employeeRequest } from "./api/employee";
import { employerRequest } from "./api/employer";
import { leaveRequest } from "./api/leave";
import { loginRequest } from "./api/login";
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

const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Content-Type': 'application/json'
}

const listener = async (req: IncomingMessage, res: ServerResponse) => {
    try {

        let result: returnMessage | any = { code: 200, message: "success" }

        if (req.method === "OPTIONS") {
            res.writeHead(204, headers);
            res.end();
            return;
        }

        if ((req.url as string).match('/company(.*?)')) {

            result = await companyRequest(req) as string | object
            console.log(JSON.stringify(result));

        }
        else if ((req.url as string).match('/login(.*?)')) {

            result = await loginRequest(req) as string | object
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
        else if ((req.url as string).match('/employee/totalovertime(.*?)')) {

            result = await totalOTRequest(req) as string | object
            console.log(JSON.stringify(result));
        }
        else if ((req.url as string).match('/employee/totalabsence(.*?)')) {

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

        res.writeHead(result.code, headers)
        res.end(JSON.stringify(result.message))

    } catch (error) {
        console.log(error);

    }


}

const server = createServer(listener)
server.listen(8080)