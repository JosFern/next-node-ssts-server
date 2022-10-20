import * as jose from 'jose'
import * as dotenv from 'dotenv';
import { addHours, differenceInMinutes } from 'date-fns';
dotenv.config()

export const generateToken = async (account: any) => {

    const { accountID, firstname, lastname, email, role } = account

    const jwt = await new jose.SignJWT({
        'accountID': accountID,
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'role': role
    })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setIssuer(`${email}`)
        .setAudience('urn:example:audience')
        .setExpirationTime(addHours(new Date(), 2).getTime())
        .sign(new TextEncoder().encode(process.env.SECRET_KEY))

    return jwt
}

export const decryptToken = (data: string) => {
    const claims = jose.decodeJwt(data)
    console.log(claims)

    const protectedHeader = jose.decodeProtectedHeader(data)
    console.log(protectedHeader)

    return claims

}

export const validateToken = async (token: any, roles: string[]) => {

    // const verification = await jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY),)

    if (token === undefined) return 401 //no token, not allowed

    const arrayToken = token.split(" ")

    const claims: object | any = decryptToken(arrayToken[1])

    const { role, exp } = claims

    console.log(differenceInMinutes(new Date(exp), new Date()));

    if (differenceInMinutes(new Date(exp), new Date()) <= 0) return 401//token expired, need login

    if (!roles.includes(role)) return 403 //forbidden, cannot access

    return 200
}