import { hash, compare } from 'bcryptjs';

export async function hashPassword(password:string) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

export async function verifyPassword(password:string, hashedPassword:string) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export async function cyrb53(str:string, seed = 0){
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
}

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const response:string = "TWOL_" + (4294967296 * (2097151 & h2) + (h1 >>> 0));
    return response;
};