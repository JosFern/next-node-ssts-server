import * as jose from 'jose'

export const generateToken = async (account: any) => {

    const { firstname, lastname, email, role } = account

    const jwt = await new jose.SignJWT({
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'role': role
    })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setIssuer(`${email}`)
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.SECRET_KEY))

    return jwt
}