// src/handlers/syntaxErrors.ts
import * as vscode from 'vscode';
import { ErrorHandler, ErrorExplanation } from '../models/types';

export class SyntaxErrorHandler implements ErrorHandler {
    canHandle(errorCode: number): boolean {
        return errorCode >= 1000 && errorCode < 2000;
    }

    handle(diagnostic: vscode.Diagnostic): ErrorExplanation {
        const errorCode = diagnostic.code as number;
        const errorMessage = diagnostic.message;

        const explanation: ErrorExplanation = {
            title: 'Syntax Error',
            description: errorMessage,
            solutions: []
        };

        switch (errorCode) {
            case 1002:
                return this.handleUnterminatedString(errorMessage);
            case 1003:
                return this.handleIdentifierExpected();
            case 1005:
                return this.handleExpectedToken(errorMessage);
            case 1009:
                return this.handleTrailingComma();
            case 1014:
                return this.handleRestParameterLast();
            case 1011:
                return this.handleElementAccessExpression();
            case 1015:
                return this.handleParameterInitializer();
            case 1016:
                return this.handleRequiredAfterOptional();
            case 1109:
                return this.handleExpressionExpected();
            case 1128:
                return this.handleDeclarationExpected();
            case 1160:
                return this.handleUnterminatedTemplate();
            case 1161:
                return this.handleUnterminatedRegExp();
            case 1196:
                return this.handleCatchClauseType();
            case 1052:
                return this.handleSetAccessorParameter();
            case 1054:
                return this.handleGetAccessorParameters();
            case 1100:
                return this.handleStrictModeIdentifier();
            case 1101:
                return this.handleStrictModeWith();
            case 1108:
                return this.handleReturnStatementFunction();
            case 1155:
                return this.handleRequiredInitialization();
            case 1184:
                return this.handleModifiersNotAllowed();
            case 1200:
                return this.handleLineTerminatorArrow();
            default:
                return explanation;
        }
    }

    private handleIdentifierExpected(): ErrorExplanation {
        return {
            title: '식별자 필요',
            description: '이 위치에 유효한 식별자가 필요합니다.',
            solutions: [
                {
                    title: '유효한 식별자 사용',
                    code: `// 올바른 식별자 예시
    const validName = value;
    function validFunction() { }
    class ValidClass { }`
                },
                {
                    title: '예약어를 식별자로 사용한 경우',
                    code: `// 예약어 대신 다른 이름 사용
    const myClass = value;  // 'class' 대신
    const myFunction = value;  // 'function' 대신`
                }
            ]
        };
    }

    private handleElementAccessExpression(): ErrorExplanation {
        return {
            title: '요소 접근 식에 인수 필요',
            description: '배열이나 객체의 요소에 접근할 때는 인덱스나 키를 제공해야 합니다.',
            solutions: [
                {
                    title: '인덱스 접근자 수정',
                    code: `const arr = [1, 2, 3];
    const item = arr[0];  // 유효한 인덱스 사용
    
    const obj = { key: "value" };
    const value = obj["key"];  // 유효한 키 사용`
                }
            ]
        };
    }

    private handleParameterInitializer(): ErrorExplanation {
        return {
            title: '매개변수가 초기화 값과 물음표를 동시에 가질 수 없음',
            description: '매개변수는 선택적 표시(?)와 기본값을 동시에 가질 수 없습니다.',
            solutions: [
                {
                    title: '선택적 매개변수 사용',
                    code: `function example(param?: string) {
        // 함수 내용
    }`
                },
                {
                    title: '기본값 사용',
                    code: `function example(param = "default") {
        // 함수 내용
    }`
                }
            ]
        };
    }

    private handleSetAccessorParameter(): ErrorExplanation {
        return {
            title: 'set 접근자는 정확히 하나의 매개변수가 필요',
            description: 'set 접근자 메서드는 반드시 하나의 매개변수를 가져야 합니다.',
            solutions: [
                {
                    title: '올바른 set 접근자',
                    code: `class Example {
        private _value: string;
        
        set value(newValue: string) {
            this._value = newValue;
        }
    }`
                }
            ]
        };
    }

    private handleGetAccessorParameters(): ErrorExplanation {
        return {
            title: 'get 접근자는 매개변수를 가질 수 없음',
            description: 'get 접근자 메서드는 매개변수를 가질 수 없습니다.',
            solutions: [
                {
                    title: '올바른 get 접근자',
                    code: `class Example {
        private _value: string;
        
        get value() {
            return this._value;
        }
    }`
                }
            ]
        };
    }

    private handleStrictModeIdentifier(): ErrorExplanation {
        return {
            title: 'strict 모드에서 유효하지 않은 식별자',
            description: 'strict 모드에서는 특정 식별자를 사용할 수 없습니다.',
            solutions: [
                {
                    title: '다른 식별자 사용',
                    code: `// 'eval'이나 'arguments' 대신 다른 이름 사용
    const processArgs = function(params) {
        // 함수 내용
    };`
                }
            ]
        };
    }

    private handleStrictModeWith(): ErrorExplanation {
        return {
            title: 'strict 모드에서 with 문 사용 불가',
            description: 'strict 모드에서는 with 문을 사용할 수 없습니다.',
            solutions: [
                {
                    title: '객체 속성 직접 접근',
                    code: `// with 문 대신 직접 접근
    const obj = { x: 10, y: 20 };
    console.log(obj.x);
    console.log(obj.y);`
                },
                {
                    title: '구조 분해 할당 사용',
                    code: `const obj = { x: 10, y: 20 };
    const { x, y } = obj;
    console.log(x);
    console.log(y);`
                }
            ]
        };
    }

    private handleReturnStatementFunction(): ErrorExplanation {
        return {
            title: 'return 문은 함수 내부에서만 사용 가능',
            description: 'return 문은 함수 본문 내부에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '함수 내부로 이동',
                    code: `function example() {
        // 여기에서 return 사용 가능
        return someValue;
    }
    
    // 전역 스코프에서는 사용 불가
    // return someValue; // 잘못된 사용`
                }
            ]
        };
    }

    private handleRequiredInitialization(): ErrorExplanation {
        return {
            title: '선언 시 초기화 필요',
            description: '이 선언은 반드시 초기화되어야 합니다.',
            solutions: [
                {
                    title: '초기값 제공',
                    code: `// 상수는 반드시 초기화 필요
    const constantValue = "initial value";
    
    // 또는 클래스 필드
    class Example {
        required: string = "initial value";
    }`
                }
            ]
        };
    }

    private handleModifiersNotAllowed(): ErrorExplanation {
        return {
            title: '수정자를 사용할 수 없음',
            description: '이 위치에서는 수정자(public, private 등)를 사용할 수 없습니다.',
            solutions: [
                {
                    title: '수정자 제거',
                    code: `// 잘못된 사용
    // public const value = 42;
    
    // 올바른 사용
    const value = 42;
    
    // 클래스 내부에서는 사용 가능
    class Example {
        public value = 42;
    }`
                }
            ]
        };
    }

    private handleLineTerminatorArrow(): ErrorExplanation {
        return {
            title: '화살표 앞에 줄 바꿈이 올 수 없음',
            description: '화살표 함수의 화살표(=>) 앞에는 줄 바꿈을 넣을 수 없습니다.',
            solutions: [
                {
                    title: '한 줄로 작성',
                    code: `// 올바른 사용
    const func = (param) => {
        return value;
    };`
                },
                {
                    title: '괄호 사용',
                    code: `// 여러 줄이 필요한 경우
    const func = (
        param1,
        param2
    ) => {
        return value;
    };`
                }
            ]
        };
    }

    private handleUnterminatedString(errorMessage: string): ErrorExplanation {
        return {
            title: '종료되지 않은 문자열',
            description: '문자열이 적절히 닫히지 않았습니다. 닫는 따옴표가 필요합니다.',
            solutions: [
                {
                    title: '문자열 닫기 - 큰따옴표 사용',
                    code: `const str = "Hello world";  // 큰따옴표로 문자열 닫기`
                },
                {
                    title: '문자열 닫기 - 작은따옴표 사용',
                    code: `const str = 'Hello world';  // 작은따옴표로 문자열 닫기`
                },
                {
                    title: '여러 줄 문자열 - 템플릿 리터럴 사용',
                    code: `const str = \`
        Hello 
        world
    \`;  // 백틱으로 여러 줄 문자열 만들기`
                }
            ]
        };
    }

    private handleExpectedToken(errorMessage: string): ErrorExplanation {
        const token = errorMessage.match(/'([^']+)'/)?.[1] || '';
        return {
            title: `'${token}' 토큰 필요`,
            description: `구문에 '${token}' 토큰이 필요합니다.`,
            solutions: [
                {
                    title: '누락된 토큰 추가',
                    code: `// 예시:
if (condition) {
    // 코드
} // 중괄호 닫기`
                }
            ]
        };
    }

    private handleTrailingComma(): ErrorExplanation {
        return {
            title: '후행 쉼표 허용되지 않음',
            description: '이 위치에서는 후행 쉼표를 사용할 수 없습니다.',
            solutions: [
                {
                    title: '후행 쉼표 제거',
                    code: `const obj = {
    prop1: value1,
    prop2: value2  // 마지막 쉼표 제거
};`
                }
            ]
        };
    }

    private handleRestParameterLast(): ErrorExplanation {
        return {
            title: 'Rest 매개변수는 마지막이어야 함',
            description: 'Rest 매개변수는 매개변수 목록의 마지막에 위치해야 합니다.',
            solutions: [
                {
                    title: 'Rest 매개변수를 마지막으로 이동',
                    code: `function example(first: string, second: number, ...rest: any[]) {
    // 함수 내용
}`
                }
            ]
        };
    }

    private handleRequiredAfterOptional(): ErrorExplanation {
        return {
            title: '선택적 매개변수 이후 필수 매개변수',
            description: '필수 매개변수는 선택적 매개변수 이후에 올 수 없습니다.',
            solutions: [
                {
                    title: '매개변수 순서 변경',
                    code: `function example(required: string, optional?: number) {
    // 함수 내용
}`
                },
                {
                    title: '모든 매개변수를 선택적으로 만들기',
                    code: `function example(param1?: string, param2?: number) {
    // 함수 내용
}`
                }
            ]
        };
    }

    private handleExpressionExpected(): ErrorExplanation {
        return {
            title: '표현식 필요',
            description: '이 위치에 유효한 표현식이 필요합니다.',
            solutions: [
                {
                    title: '유효한 표현식 추가',
                    code: `const result = 1 + 2; // 유효한 표현식
if (condition) { // 조건식 필요
    // 코드
}`
                }
            ]
        };
    }

    private handleDeclarationExpected(): ErrorExplanation {
        return {
            title: '선언문 필요',
            description: '이 위치에 유효한 선언문이 필요합니다.',
            solutions: [
                {
                    title: '변수 선언 추가',
                    code: `let variable: string;
const constant = "value";`
                },
                {
                    title: '함수 선언 추가',
                    code: `function functionName() {
    // 함수 내용
}`
                }
            ]
        };
    }

    private handleUnterminatedTemplate(): ErrorExplanation {
        return {
            title: '종료되지 않은 템플릿 리터럴',
            description: '템플릿 리터럴이 적절하게 닫히지 않았습니다.',
            solutions: [
                {
                    title: '템플릿 리터럴 닫기',
                    code: `const template = \`
    여러 줄
    템플릿 리터럴
\`; // 백틱으로 닫기`
                }
            ]
        };
    }

    private handleUnterminatedRegExp(): ErrorExplanation {
        return {
            title: '종료되지 않은 정규식',
            description: '정규 표현식이 적절하게 닫히지 않았습니다.',
            solutions: [
                {
                    title: '정규식 닫기',
                    code: `const regex = /pattern/g; // 슬래시로 닫고 플래그 추가`
                }
            ]
        };
    }

    private handleCatchClauseType(): ErrorExplanation {
        return {
            title: 'Catch 절의 타입 제한',
            description: 'Catch 절의 변수 타입 주석은 any 또는 unknown이어야 합니다.',
            solutions: [
                {
                    title: 'any 타입 사용',
                    code: `try {
    // 코드
} catch (error: any) {
    // 에러 처리
}`
                },
                {
                    title: 'unknown 타입 사용 (권장)',
                    code: `try {
    // 코드
} catch (error: unknown) {
    // 타입 가드를 사용한 안전한 에러 처리
    if (error instanceof Error) {
        console.log(error.message);
    }
}`
                }
            ]
        };
    }
}