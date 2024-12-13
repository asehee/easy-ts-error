import * as vscode from 'vscode';

interface ErrorExplanation {
	title: string;
	description: string;
	detail: string;
	solutions: Solution[];
}

interface Solution {
	title: string;
	code: string;
}

export function activate(context: vscode.ExtensionContext) {
	// TypeScript 에러를 설명하는 커맨드 등록
	const disposable = vscode.commands.registerCommand('ts-error-explainer.explainError', async () => {
		// 현재 활성화된 에디터 가져오기
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		// 현재 커서 위치의 진단 정보(에러) 가져오기
		const position = editor.selection.active;
		const diagnostics = vscode.languages.getDiagnostics(editor.document.uri)
			.filter(diagnostic => diagnostic.range.contains(position));

		if (diagnostics.length === 0) {
			vscode.window.showInformationMessage('No TypeScript error at current position');
			return;
		}

		// 첫 번째 에러 메시지에 대한 설명 생성
		const explanation = explainTypeScriptError(diagnostics[0]);

		// 설명을 보여주는 웹뷰 패널 생성
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

// TypeScript 에러 메시지를 분석하고 설명을 생성하는 함수
function explainTypeScriptError(diagnostic: vscode.Diagnostic): ErrorExplanation {
	const errorCode = diagnostic.code;
	const errorMessage = diagnostic.message;

	// 기본 설명 객체
	const explanation: ErrorExplanation = {
		title: 'TypeScript Error',
		description: errorMessage,
		detail: '',
		solutions: []
	};
	// 에러 코드별 설명 생성
	switch (errorCode) {
		case 2589: // 재귀적 타입 정의 에러
			explanation.title = '무한한 타입 중첩 감지';
			explanation.description = '타입이 자기 자신을 무한히 참조하고 있습니다.';
			explanation.solutions = [
				{
					title: '깊이 제한 추가',
					code: `type Safe<T, Depth extends number = 5> = Depth extends 0 
    						? never 
    						: { value: T; next: Safe<T, [-1, 0, 1, 2, 3, 4][Depth]> };`
				},
				{
					title: 'interface 사용',
					code: `interface Safe<T> {
   							 value: T;
   							 next: Safe<T>;
							}`
				}
			];
			break;
		// 다른 에러 코드들에 대한 처리 추가 예정
	}

	return explanation;
}

// 웹뷰 컨텐츠 생성 함수
function getWebviewContent(explanation: any) {
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
            ${explanation.solutions.map((solution: any) => `
                <div class="solution">
                    <h4>${solution.title}</h4>
                    <pre><code>${solution.code}</code></pre>
                </div>
            `).join('')}
        </body>
    </html>`;
}

export function deactivate() { }