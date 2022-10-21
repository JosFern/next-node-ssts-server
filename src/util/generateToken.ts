import * as jose from 'jose'
import * as dotenv from 'dotenv';
import { addHours, differenceInMinutes } from 'date-fns';
import { createHmac, createPrivateKey, createSecretKey, KeyObject } from 'crypto';
dotenv.config()
import jwt from 'jsonwebtoken';

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
        .setIssuedAt(new Date().getTime())
        .setIssuer('ssts')
        .setAudience('ssts')
        .setExpirationTime(addHours(new Date(), 2).getTime())
        .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY))

    console.log(jwt);


    return jwt
}

export const encryptToken = async (data: object) => {

    const jwt = await new jose.SignJWT({ 'urn:example:claim': true, 'sub': JSON.stringify(data) })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setIssuer('ssts')
        .setAudience('ssts')
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY))

    return jwt
}

export const decryptToken = (data: string) => {
    const claims = jose.decodeJwt(data)
    // console.log(claims)

    const protectedHeader = jose.decodeProtectedHeader(data)
    // console.log(protectedHeader)

    return claims

}

export const validateToken = async (token: any, roles: string[] = []) => {

    if (token === undefined) return 401 //no token, not allowed

    let getToken = token

    if (token.includes('Bearer')) {
        const arrayToken = token.split(" ")
        getToken = arrayToken[1]
    }

    const { payload, protectedHeader }: any = await jose.jwtVerify(getToken, new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY), {
        issuer: 'ssts',
        audience: 'ssts',
    }).catch(err => {
        console.log(err);
        return err
    })

    // console.log(protectedHeader)
    // console.log(payload)

    if (roles.length > 0) {
        const { role } = JSON.parse(payload.sub)
        // console.log(role);

        if (!roles.includes(role)) return 403 //forbidden, cannot access
    }

    return JSON.parse(payload.sub)
}



// const secretKey = createPrivateKey(process.env.SECRET_KEY as string)

    // console.log(secretKey);

    // const envSecret = "-----BEGIN PRIVATE KEY----- D4CD6F2EB72C4195732CD28DF9D84E22 -----END PRIVATE KEY----- "

    // const atob = (envSecret: string) => Buffer.from(envSecret, 'base64').toString('binary')
    // const btoa = (envSecret: string) => Buffer.from(envSecret, 'binary').toString('base64')


    // const payload = new TextEncoder().encode(JSON.stringify({
    //     'accountID': accountID,
    //     'firstname': firstname,
    //     'lastname': lastname,
    //     'email': email,
    //     'role': role
    // }))

    // const token = jwt.sign({
    //     'accountID': accountID,
    //     'firstname': firstname,
    //     'lastname': lastname,
    //     'email': email,
    //     'role': role
    // }, process.env.SECRET_KEY as string)

    // const algorithm = 'ES256'
    // const pkcs8 = `-----BEGIN PRIVATE KEY-----
    // MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
    // nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
    // l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
    // -----END PRIVATE KEY-----`
    // const ecPrivateKey = await jose.importPKCS8(pkcs8, algorithm)

    // const jwt: any = await new jose.GeneralEncrypt(payload)
    //     .setProtectedHeader({ enc: 'A256GCM' })
    //     .addRecipient(ecPrivateKey)
    //     .encrypt()
    // .setIssuedAt()
    // .setIssuer('ssts')
    // .setAudience('ssts')
    // .setExpirationTime(addHours(new Date(), 2).getTime())
