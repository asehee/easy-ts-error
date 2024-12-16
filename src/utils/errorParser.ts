export class ErrorParser {
    static getErrorCode(message: string): number {
        const match = message.match(/ts\((\d+)\)/);
        return match ? parseInt(match[1]) : 0;
    }

    static extractIdentifier(message: string): string | undefined {
        return message.match(/'([^']+)'/)?.[1];
    }

    static extractTypeInfo(message: string): { sourceType?: string; targetType?: string } {
        const sourceType = message.match(/Type '([^']+)'/)?.[1];
        const targetType = message.match(/type '([^']+)'/)?.[1];
        return { sourceType, targetType };
    }
}