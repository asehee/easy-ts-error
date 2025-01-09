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
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root {
            --primary-color: #007ACC;
            --error-color: #E51400;
            --background-color: #FFFFFF;
            --code-background: #1E1E1E;
            --text-color: #333333;
            --border-radius: 8px;
            --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            padding: 2rem;
            margin: 0;
            background-color: var(--background-color);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .error-card {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .error-header {
            background: var(--error-color);
            color: white;
            padding: 1rem 1.5rem;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .error-body {
            padding: 1.5rem;
        }

        .error-description {
            background: #F8F9FA;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            margin-bottom: 1.5rem;
            font-size: 1rem;
            color: #495057;
        }

        .solutions-section {
            margin-top: 2rem;
        }

        .solution-title {
            color: var(--primary-color);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 1.5rem 0 1rem;
        }

        .code-container {
            position: relative;
            margin: 1rem 0;
        }

        pre {
            background: var(--code-background);
            color: #D4D4D4;
            padding: 1.5rem;
            border-radius: var(--border-radius);
            overflow-x: auto;
            margin: 0;
        }

        code {
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        .copy-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            color: #D4D4D4;
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .copy-button:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .no-solutions {
            color: #6C757D;
            font-style: italic;
            padding: 1rem;
            text-align: center;
            background: #F8F9FA;
            border-radius: var(--border-radius);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-card">
            <div class="error-header">
                ${explanation.title}
            </div>
            <div class="error-body">
                <div class="error-description">
                    ${explanation.description}
                </div>
                ${explanation.solutions && explanation.solutions.length > 0 ? `
                    <div class="solutions-section">
                        <h3>해결 방법</h3>
                        ${explanation.solutions.map(solution => `
                            <div class="solution">
                                <div class="solution-title">${solution.title}</div>
                                <div class="code-container">
                                    <button class="copy-button" onclick="copyCode(this)">Copy</button>
                                    <pre><code>${solution.code}</code></pre>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<div class="no-solutions">제안된 해결 방법이 없습니다.</div>'}
            </div>
        </div>
    </div>

    <script>
        function copyCode(button) {
            const pre = button.nextElementSibling;
            const code = pre.textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = 'rgba(40, 167, 69, 0.2)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            });
        }

        console.log('Webview rendered with explanation:', ${JSON.stringify(explanation)});
    </script>
</body>
</html>`;
}

export function deactivate() { }