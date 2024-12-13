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
        // 기존 switch 문에 다음 case들을 추가:

        // 1. Type Errors (2000-2999)
        case 2300: // Duplicate identifier
            const duplicateIdentifier = errorMessage.match(/'([^']+)'/)?.[1] || 'unknown';
            explanation.title = `중복된 식별자 '${duplicateIdentifier}'`;
            explanation.description = `'${duplicateIdentifier}'가 이미 선언되어 있습니다.`;
            explanation.solutions = [
                {
                    title: '식별자 이름 변경',
                    code: `// 다른 이름으로 변경\nconst ${duplicateIdentifier}2 = value;`
                },
                {
                    title: '기존 선언 제거',
                    code: `// 기존 선언을 제거하거나 주석 처리`
                }
            ];
            break;

        case 2304: // Cannot find name
            const missingIdentifier = errorMessage.match(/Cannot find name '([^']+)'/)?.[1] || 'unknown';
            explanation.title = `'${missingIdentifier}' 를 찾을 수 없음`;
            explanation.description = `'${missingIdentifier}' 이름의 변수나 타입을 찾을 수 없습니다.`;
            explanation.solutions = [
                {
                    title: '변수 선언',
                    code: `let ${missingIdentifier}: any; // 적절한 타입으로 변경하세요`
                },
                {
                    title: 'import 문 추가',
                    code: `import { ${missingIdentifier} } from './module';`
                }
            ];
            break;

        case 2322: // Type is not assignable
            const sourceType = errorMessage.match(/Type '([^']+)'/)?.[1];
            const targetType = errorMessage.match(/type '([^']+)'/)?.[1];
            explanation.title = `타입 '${sourceType}'을 '${targetType}'에 할당할 수 없음`;
            explanation.description = `'${sourceType}' 타입은 '${targetType}' 타입에 할당할 수 없습니다.`;
            explanation.solutions = [
                {
                    title: '타입 단언 사용',
                    code: `(value as ${targetType})`
                },
                {
                    title: '타입 변환 함수 사용',
                    code: `function to${targetType}(value: ${sourceType}): ${targetType} {
// 적절한 변환 로직 구현
}`
                }
            ];
            break;

        // 2. Syntax Errors (1000-1999)
        case 1005: // Expected token
            const expectedToken = errorMessage.match(/'([^']+)'/)?.[1];
            explanation.title = `'${expectedToken}' 토큰이 필요함`;
            explanation.description = `구문에 '${expectedToken}' 토큰이 필요합니다.`;
            explanation.solutions = [
                {
                    title: '누락된 토큰 추가',
                    code: `// 예시:\nif (condition) ${expectedToken}
// 코드
}`
                }
            ];
            break;

        case 1109: // Expression expected
            explanation.title = "표현식이 필요함";
            explanation.description = "이 위치에 유효한 표현식이 필요합니다.";
            explanation.solutions = [
                {
                    title: '유효한 표현식 추가',
                    code: `// 예시:\nlet x = /* 표현식 */;`
                }
            ];
            break;

        // 3. Module Errors (2300-2399)
        case 2307: // Cannot find module
            const moduleName = errorMessage.match(/'([^']+)'/)?.[1];
            explanation.title = `모듈 '${moduleName}'을 찾을 수 없음`;
            explanation.description = `모듈 '${moduleName}' 또는 해당하는 타입 선언을 찾을 수 없습니다.`;
            explanation.solutions = [
                {
                    title: '모듈 설치',
                    code: `npm install ${moduleName}\nnpm install --save-dev @types/${moduleName}`
                },
                {
                    title: '경로 확인',
                    code: `// 상대 경로 확인\nimport { something } from './${moduleName}';`
                }
            ];
            break;

        // 4. Decorator Errors (1200-1299)
        case 1206: // Invalid decorator
            explanation.title = "데코레이터가 유효하지 않음";
            explanation.description = "이 위치에서는 데코레이터를 사용할 수 없습니다.";
            explanation.solutions = [
                {
                    title: '데코레이터 위치 변경',
                    code: `@decorator
class Example {
// ...
}`
                },
                {
                    title: 'experimentalDecorators 활성화',
                    code: `// tsconfig.json
{
"compilerOptions": {
    "experimentalDecorators": true
}
}`
                }
            ];
            break;

        // 5. Async/Await Errors (1300-1399)
        case 1308: // Invalid await
            explanation.title = "'await' 사용이 유효하지 않음";
            explanation.description = "'await' 표현식은 async 함수 내에서만 사용할 수 있습니다.";
            explanation.solutions = [
                {
                    title: 'async 함수로 변경',
                    code: `async function example() {
await somePromise();
}`
                },
                {
                    title: '상위 함수를 async로 변경',
                    code: `const example = async () => {
await somePromise();
}`
                }
            ];
            break;

        // 6. Class Errors (2600-2699)
        case 2673: // Private constructor
            explanation.title = "private 생성자에 접근할 수 없음";
            explanation.description = "클래스의 생성자가 private으로 선언되어 있어 외부에서 접근할 수 없습니다.";
            explanation.solutions = [
                {
                    title: '생성자 접근 제한자 변경',
                    code: `class Example {
public constructor() {
    // ...
}
}`
                },
                {
                    title: '정적 팩토리 메서드 사용',
                    code: `class Example {
private constructor() {}
static create() {
    return new Example();
}
}`
                }
            ];
            break;

        // 7. Interface Errors (2400-2499)
        case 2420: // Class incorrectly implements interface
            explanation.title = "인터페이스 구현이 잘못됨";
            explanation.description = "클래스가 인터페이스의 모든 멤버를 올바르게 구현하지 않았습니다.";
            explanation.solutions = [
                {
                    title: '누락된 멤버 구현',
                    code: `class Example implements Interface {
// 필요한 모든 멤버 구현
requiredMethod() {
    // 구현
}
requiredProperty: string;
}`
                }
            ];
            break;

        // 8. Generic Errors (2500-2599)
        case 2558: // Expected type arguments
            explanation.title = "타입 인수가 필요함";
            explanation.description = "제네릭 타입에 필요한 타입 인수가 제공되지 않았습니다.";
            explanation.solutions = [
                {
                    title: '타입 인수 추가',
                    code: `// 예시:\nconst value: Generic<string> = new Generic<string>();`
                },
                {
                    title: '타입 추론 사용',
                    code: `// 타입 추론이 가능한 경우:\nconst value = new Generic();`
                }
            ];
            break;

        // 9. Strict Null Checks Errors (2531-2533)
        case 2531: // Object is possibly null
            explanation.title = "객체가 null일 수 있음";
            explanation.description = "이 객체는 null일 수 있어 안전하지 않은 접근입니다.";
            explanation.solutions = [
                {
                    title: 'null 체크 추가',
                    code: `if (obj !== null) {
obj.property;
}`
                },
                {
                    title: '옵셔널 체이닝 사용',
                    code: `obj?.property;`
                },
                {
                    title: 'non-null 단언 사용',
                    code: `obj!.property; // null이 아님이 확실한 경우에만 사용`
                }
            ];
            break;

        // 10. JSX Errors (2600-2699)
        case 2657: // JSX element must have parent
            explanation.title = "JSX 요소에 부모가 필요함";
            explanation.description = "JSX 표현식은 하나의 부모 요소를 가져야 합니다.";
            explanation.solutions = [
                {
                    title: 'Fragment 사용',
                    code: `<>
<Child1 />
<Child2 />
</>`
                },
                {
                    title: '단일 부모 요소로 감싸기',
                    code: `<div>
<Child1 />
<Child2 />
</div>`
                }
            ];
            break;

        // 11. Import/Export Errors (1147-1149)
        case 1192: // Module has no default export
            explanation.title = "모듈에 기본 내보내기가 없음";
            explanation.description = "이 모듈은 기본 내보내기(default export)를 가지고 있지 않습니다.";
            explanation.solutions = [
                {
                    title: '이름 있는 가져오기 사용',
                    code: `import { namedExport } from 'module';`
                },
                {
                    title: '모듈에 기본 내보내기 추가',
                    code: `// module.ts
export default someValue;`
                }
            ];
            break;

        // 12. Type Declaration Errors (2300-2399)
        case 2304: // Cannot find name
            explanation.title = `이름을 찾을 수 없음`;
            explanation.description = `선언되지 않은 이름이 사용되었습니다.`;
            explanation.solutions = [
                {
                    title: '타입 선언 추가',
                    code: `interface MissingType {
// 필요한 타입 정의
}`
                },
                {
                    title: '타입 정의 가져오기',
                    code: `import type { MissingType } from './types';`
                }
            ];
            break;

        case 2792: // Cannot find module, try nodenext
            explanation.title = "노드 모듈 해결 방식 문제";
            explanation.description = "모듈을 찾을 수 없습니다. moduleResolution 설정을 확인하세요.";
            explanation.solutions = [
                {
                    title: 'moduleResolution 설정 변경',
                    code: `// tsconfig.json
{
"compilerOptions": {
    "moduleResolution": "nodenext"
}
}`
                },
                {
                    title: 'paths 설정 추가',
                    code: `// tsconfig.json
{
"compilerOptions": {
    "paths": {
        "*": ["./node_modules/*"]
    }
}
}`
                }
            ];
            break;
        case 2589:
            explanation.title = '무한 타입 중첩 감지';
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
        case 2741:
            const missingProperty = errorMessage.match(/'([^']+)'/)?.[1];
            const missingType = errorMessage.match(/type '([^']+)'/)?.[1];
            const requiredType = errorMessage.match(/type '([^']+)'$/)?.[1];

            explanation.title = `'${missingProperty}' 속성이 '${missingType}' 타입에 없음`;
            explanation.description = `'${missingType}' 타입에 '${requiredType}'에서 요구하는 '${missingProperty}' 속성이 없습니다.`;
            explanation.solutions = [
                {
                    title: '누락된 속성 추가하기',
                    code: `type ${missingType} = {
                             ${missingProperty}: /* 적절한 타입 */;
                              // 다른 속성들...
                            };`
                },
                {
                    title: '속성을 선택적으로 만들기',
                    code: `type ${requiredType} = {
                            ${missingProperty}?: /* 적절한 타입 */;
                            // 다른 속성들...
                            };`
                }
            ];
            break;
        case 2345:
            const argumentType = errorMessage.match(/Argument of type '([^']+)'/)?.[1];
            const parameterType = errorMessage.match(/parameter of type '([^']+)'/)?.[1];

            explanation.title = `'${argumentType}' 타입의 인수를 '${parameterType}' 타입의 매개변수에 할당할 수 없음`;
            explanation.description = `'${argumentType}' 타입의 인수는 '${parameterType}' 타입의 매개변수에 할당할 수 없습니다.`;
            explanation.solutions = [
                {
                    title: '인수 타입 변경',
                    code: `// 인수의 타입을 ${parameterType} 타입에 맞게 변경합니다.`
                },
                {
                    title: '매개변수 타입 변경',
                    code: `function example(param: ${argumentType}) {
                             // 함수 내용
                             }`
                }
            ];
            break;

        // case 2739: // "Type '...' is missing the following properties from type '...': ..." 에러
        //     const missingProperties = errorMessage.match(/'([^']+)'/g)?.[1];
        //     const sourceType = errorMessage.match(/type '([^']+)'/)?.[1];
        //     const targetType = errorMessage.match(/type '([^']+)'$/)?.[1];

        //     explanation.title = `'${sourceType}' 타입에 '${targetType}' 타입의 속성이 없음`;
        //     explanation.description = `'${sourceType}' 타입에 '${targetType}' 타입에 필요한 다음 속성이 없습니다: ${missingProperties}.`;
        //     explanation.solutions = [
        //         {
        //             title: '누락된 속성 추가',
        //             code: `type ${sourceType} = {
        //                         ${missingProperties}: /* 적절한 타입 */;
        //                         // 기존 속성들...
        //                     };`
        //         }
        //     ];
        //     break;
        case 2552: // "Cannot find name '...'." 에러
            const missingName = errorMessage.match(/'([^']+)'/)?.[1];

            explanation.title = `'${missingName}'을 찾을 수 없음`;
            explanation.description = `'${missingName}'이라는 이름을 찾을 수 없습니다. 선언되지 않았거나 잘못된 이름일 수 있습니다.`;
            explanation.solutions = [
                {
                    title: '변수 또는 함수 선언 추가',
                    code: `// ${missingName}에 대한 변수 또는 함수 선언을 추가합니다.
const ${missingName} = /* 적절한 값 또는 함수 */;`
                },
                {
                    title: '철자 오류 확인',
                    code: `// ${missingName}의 철자가 올바른지 확인하고 수정합니다.`
                }
            ];
            break;
        case 2304: // "Cannot find name '...' in '...'." 에러
            const missingModuleName = errorMessage.match(/'([^']+)' in/)?.[1];
            const missingModule = errorMessage.match(/in '([^']+)'/)?.[1];

            explanation.title = `'${missingModule}'에서 '${missingModuleName}'을 찾을 수 없음`;
            explanation.description = `'${missingModule}' 모듈에서 '${missingModuleName}'을 찾을 수 없습니다. 모듈을 잘못 가져왔거나 해당 모듈에 '${missingModuleName}'이 정의되어 있지 않을 수 있습니다.`;
            explanation.solutions = [
                {
                    title: '모듈 가져오기 확인',
                    code: `// ${missingModule} 모듈이 올바르게 가져왔는지 확인하고 필요한 경우 수정합니다.
import { ${missingModuleName} } from '${missingModule}';`
                },
                {
                    title: '모듈에서 export 확인',
                    code: `// ${missingModule} 모듈 내에서 ${missingModuleName}이 export되었는지 확인합니다.`
                }
            ];
            break;
        case 2322: // "Type '...' is not assignable to type '...'" 에러
            const firstType = errorMessage.match(/Type '([^']+)'/)?.[1];
            const secondType = errorMessage.match(/type '([^']+)'/)?.[1];

            explanation.title = `'${firstType}' 타입을 '${secondType}' 타입에 할당할 수 없음`;
            explanation.description = `'${firstType}' 타입은 '${secondType}' 타입에 할당할 수 없습니다.`;
            explanation.solutions = [
                {
                    title: '타입 캐스팅 사용',
                    code: `const value: ${secondType} = /* ${firstType} 값 */ as ${secondType};`
                },
                {
                    title: '타입 선언 변경',
                    code: `const value: ${firstType} = /* ${firstType} 값 */;`
                }
            ];
            break;

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