import CryptoJS from "crypto";
import { getKey } from "./encryptKey";
import {
    getPassword as kGetPassword,
    setPassword as kSetPassword,
    deletePassword
} from "keytar";

export async function getPassword() {
    const password = await kGetPassword(
        "com.zephra.icloud-app",
        "appleId-password"
    );

    let object;

    try {
        object = JSON.parse(password);
    } catch (e) {}

    return object ? decrypt(object) : "";
}

export function setPassword(password: string) {
    if (password)
        kSetPassword(
            "com.zephra.icloud-app",
            "appleId-password",
            JSON.stringify(encrypt(password))
        );
    else deletePassword("com.zephra.icloud-app", "appleId-password");
}

function encrypt(password: string) {
    const iv = CryptoJS.randomBytes(16),
        cipher = CryptoJS.createCipheriv("aes-256-ctr", getKey(), iv);

    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);

    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex")
    };
}

function decrypt(hash: { iv: string; content: string }) {
    const decipher = CryptoJS.createDecipheriv(
            "aes-256-ctr",
            getKey(),
            Buffer.from(hash.iv, "hex")
        ),
        decrypted = Buffer.concat([
            decipher.update(Buffer.from(hash.content, "hex")),
            decipher.final()
        ]);

    return decrypted.toString();
}
