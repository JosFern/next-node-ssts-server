import { IncomingMessage } from 'http'
import * as url from "url";
import { each } from "lodash";

export const getJSONDataFromRequestStream = (req: IncomingMessage) => new Promise((resolve) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    req.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())))
})

export const getQueryParams = (req: IncomingMessage) => {
    const requestURL = url.parse(req.url as string, true)
    return requestURL.query ? requestURL.query : {}
}
interface paramsInput {
    [key: string]: string
}
export const getPathParams = (url: string, path: string) => {
    console.log(url);
    console.log(path);

    const explodeURL = url.split('/')
    console.log(explodeURL);

    const explodePath = path.split('/')
    console.log(explodePath);
    const params: paramsInput = {}
    each(explodePath, (resources, index) => {
        const pathParam = resources.match(/:(\w.*)/)
        if (pathParam && explodeURL[index]) {
            params[pathParam[1]] = explodeURL[index]
        }
    })

    console.log(params);


    return params
}