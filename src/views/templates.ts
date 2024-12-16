// src/views/templates.ts
import { ErrorExplanation } from '../models/types';

export function getWebviewContent(explanation: ErrorExplanation): string {
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
            ${explanation.solutions.map(solution => `
                <div class="solution">
                    <h4>${solution.title}</h4>
                    <pre><code>${solution.code}</code></pre>
                </div>
            `).join('')}
        </body>
    </html>`;
}