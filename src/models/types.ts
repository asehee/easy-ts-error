export interface ErrorExplanation {
    title: string;
    description: string;
    solutions: Solution[];
}

export interface Solution {
    title: string;
    code: string;
}

export interface ErrorHandler {
    canHandle(errorCode: number): boolean;
    handle(errorMessage: string): ErrorExplanation;
}

export enum ErrorCategory {
    Syntax = 'Syntax',
    Type = 'Type',
    Module = 'Module',
    Config = 'Config'
}