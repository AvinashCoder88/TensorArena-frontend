import { createHmac, randomBytes, timingSafeEqual } from "crypto"

// Tokens expire quickly to reduce blast radius if leaked.
export const ADMIN_TOKEN_TTL_MS = 15 * 60 * 1000

type AdminTokenPayload = {
    exp: number
    nonce: string
}

const getTokenSecret = (): string => {
    const secret = process.env.ADMIN_TOKEN_SECRET ?? process.env.NEXTAUTH_SECRET
    if (!secret) {
        throw new Error("Admin token secret is not configured")
    }
    return secret
}

export const generateAdminToken = () => {
    const secret = getTokenSecret()
    const payload: AdminTokenPayload = {
        exp: Date.now() + ADMIN_TOKEN_TTL_MS,
        nonce: randomBytes(16).toString("hex"),
    }

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url")
    const signature = createHmac("sha256", secret).update(payloadBase64).digest("base64url")

    return {
        token: `${payloadBase64}.${signature}`,
        expiresAt: payload.exp,
    }
}

export const verifyAdminToken = (token?: string | null): AdminTokenPayload | null => {
    if (!token) {
        return null
    }

    const [payloadBase64, signature] = token.split(".")
    if (!payloadBase64 || !signature) {
        return null
    }

    const secret = getTokenSecret()
    const expectedSignature = createHmac("sha256", secret).update(payloadBase64).digest()

    let providedSignature: Buffer
    try {
        providedSignature = Buffer.from(signature, "base64url")
    } catch {
        return null
    }

    if (providedSignature.length !== expectedSignature.length) {
        return null
    }

    if (!timingSafeEqual(providedSignature, expectedSignature)) {
        return null
    }

    let payload: AdminTokenPayload
    try {
        payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"))
    } catch {
        return null
    }

    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
        return null
    }

    return payload
}
