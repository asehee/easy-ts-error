import * as vscode from 'vscode';
import { TypeErrorHandler } from './handlers/typeErrors';
import { ErrorExplanation, Solution } from './models/types';
import { SyntaxErrorHandler } from './handlers/sintaxErrors';

// extension.ts
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

        console.log('Found diagnostics:', diagnostics);

        if (diagnostics.length === 0) {
            console.log('No TypeScript error at current position');
            vscode.window.showInformationMessage('No TypeScript error at current position');
            return;
        }

        const diagnostic = diagnostics[0];
        console.log('Processing diagnostic:', diagnostic);
        console.log('Error code:', diagnostic.code);
        console.log('Error message:', diagnostic.message);

        const explanation = explainTypeScriptError(diagnostic);
        console.log('Generated explanation:', explanation);

        const panel = vscode.window.createWebviewPanel(
            'tsErrorExplanation',
            'TypeScript Error Explanation',
            vscode.ViewColumn.Two,
            {}
        );

        const webviewContent = getWebviewContent(explanation);
        console.log('Generated webview content:', webviewContent);
        
        panel.webview.html = webviewContent;
    });

    context.subscriptions.push(disposable);
}

function explainTypeScriptError(diagnostic: vscode.Diagnostic): ErrorExplanation {
    console.log('Explaining error for diagnostic:', diagnostic);
    
    const errorCode = Number(diagnostic.code);
    console.log('Error code (number):', errorCode);

    const typeErrorHandler = new TypeErrorHandler();
    
    if (typeErrorHandler.canHandle(errorCode)) {
        console.log('TypeErrorHandler can handle this error');
        const explanation = typeErrorHandler.handle(diagnostic);
        console.log('Handler returned explanation:', explanation);
        return explanation;
    }

    console.log('No handler found for this error code');
    return {
        title: 'Unhandled TypeScript Error',
        description: diagnostic.message,
        solutions: []
    };
}

function getWebviewContent(explanation: ErrorExplanation): string {
    console.log('Creating webview content for explanation:', explanation);
    
    // 솔루션이 있는지 확인
    if (!explanation.solutions || explanation.solutions.length === 0) {
        console.log('No solutions in explanation');
    } else {
        console.log('Found solutions:', explanation.solutions);
    }

    return `<!DOCTYPE html>
    <html>
        <head>
            <style>
                body { font-family: system-ui; padding: 20px; }
                .error-title { color: #f44336; font-size: 1.2em; margin-bottom: 15px; }
                .explanation { margin: 10px 0; padding: 10px; background: #f5f5f5; }
                .solution { margin: 10px 0; padding: 10px; background: #e3f2fd; }
                pre { background: #2d2d2d; color: #ccc; padding: 10px; border-radius: 4px; }
                code { font-family: 'Consolas', 'Courier New', monospace; }
            </style>
        </head>
        <body>
            <div class="error-title">${explanation.title}</div>
            <div class="explanation">${explanation.description}</div>
            ${explanation.solutions && explanation.solutions.length > 0 ? `
                <h3>해결 방법:</h3>
                ${explanation.solutions.map(solution => `
                    <div class="solution">
                        <h4>${solution.title}</h4>
                        <pre><code>${solution.code}</code></pre>
                    </div>
                `).join('')}
            ` : '<p>해결 방법이 없습니다.</p>'}
            <script>
                console.log('Webview rendered with explanation:', ${JSON.stringify(explanation)});
            </script>
        </body>
    </html>`;
}

export function deactivate() { }