export class RandomDataUtil {
    static generateEmail(firstName: string): string {
        const emailNew =  `${firstName}${Date.now()}@test.com`;
        console.log("New Email : ",emailNew);
        return emailNew;
    }
    static generatePhone(): string {
        return `403${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
}