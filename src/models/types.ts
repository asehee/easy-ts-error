// src/models/types.ts
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
    // errorMessage 대신 vscode.Diagnostic을 받도록 수정
    handle(diagnostic: vscode.Diagnostic): ErrorExplanation;
}