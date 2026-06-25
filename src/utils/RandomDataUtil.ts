export class RandomDataUtil {
    static generateEmail(firstName: string): string {
        return `${firstName}${Date.now()}@test.com`;
    }
    static generatePhone(): string {
        return `403${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
}