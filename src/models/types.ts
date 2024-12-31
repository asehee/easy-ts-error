import * as vscode from 'vscode';

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
    handle(diagnostic: vscode.Diagnostic): ErrorExplanation;
}