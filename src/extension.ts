import * as vscode from 'vscode';
import { TypeErrorHandler } from './handlers/typeErrors';
import { ErrorExplanation, Solution } from './models/types';
import { SyntaxErrorHandler } from './handlers/sintaxErrors';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('ts-error-explainer.explainError', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            console.log('No active editor');
            return;
        }

        const position = editor.selection.active;
        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri)
            .filter(diagnostic => diagnostic.range.contains(position));

        if (diagnostics.length === 0) {
            console.log('No TypeScript error at current position');
            vscode.window.showInformationMessage('No TypeScript error at current position');
            return;
        }

        console.log('Explaining error:', diagnostics[0]);
        const explanation = explainTypeScriptError(diagnostics[0]);

        const panel = vscode.window.createWebviewPanel(
            'tsErrorExplanation',
            'TypeScript Error Explanation',
            vscode.ViewColumn.Two,
            {}
        );

        panel.webview.html = getWebviewContent(explanation);
    });

    context.subscriptions.push(disposable);
}

function explainTypeScriptError(diagnostic: vscode.Diagnostic): ErrorExplanation {
    const errorCode = Number(diagnostic.code);

    // 에러 핸들러 인스턴스들
    const syntaxErrorHandler = new SyntaxErrorHandler();
    const typeErrorHandler = new TypeErrorHandler();

    // 1000번대 에러는 SyntaxErrorHandler로 처리
    if (syntaxErrorHandler.canHandle(errorCode)) {
        return syntaxErrorHandler.handle(diagnostic);
    }
    
    // 나머지 에러는 TypeErrorHandler로 처리
    if (typeErrorHandler.canHandle(errorCode)) {
        return typeErrorHandler.handle(diagnostic);
    }

    // 처리되지 않은 에러에 대한 기본 응답
    return {
        title: 'Unhandled TypeScript Error',
        description: diagnostic.message,
        solutions: []
    };
}

function getWebviewContent(explanation: ErrorExplanation): string {
    return `<!DOCTYPE html>
    <html>
        <head>
            <style>
                body { 
                    padding: 15px;
                    font-family: system-ui;
                }
                .error-title {
                    color: #f44336;
                    font-size: 1.2em;
                    margin-bottom: 15px;
                }
                .explanation {
                    margin: 10px 0;
                    padding: 10px;
                    background: #f5f5f5;
                    border-left: 4px solid #f44336;
                }
                .solution {
                    margin: 10px 0;
                    padding: 10px;
                    background: #f5f5f5;
                    border-left: 4px solid #4caf50;
                }
                pre {
                    background: #2d2d2d;
                    color: #ccc;
                    padding: 10px;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="error-title">${explanation.title}</div>
            <div class="explanation">
                ${explanation.description}
            </div>
            <h3>해결 방법:</h3>
            ${explanation.solutions.map((solution: Solution) => `
                <div class="solution">
                    <h4>${solution.title}</h4>
                    <pre><code>${solution.code}</code></pre>
                </div>
            `).join('')}
        </body>
    </html>`;
}

export function deactivate() { }