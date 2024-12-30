// src/handlers/syntaxErrors.ts
import * as vscode from 'vscode';
import { ErrorHandler, ErrorExplanation } from '../models/types';

export class SyntaxErrorHandler implements ErrorHandler {
    canHandle(errorCode: number): boolean {
        return errorCode >= 1000 && errorCode < 2000;
    }

    handle(diagnostic: vscode.Diagnostic): ErrorExplanation {
        console.log('TypeErrorHandler handling diagnostic:', diagnostic);
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
                case 1006: // 파일 끝에 예기치 않은 토큰
                return this.handleUnexpectedEndToken(errorMessage);
            case 1019: // 중첩된 템플릿 표현식 불가
                return this.handleNestedTemplate();
            case 1026: // 중복된 case 레이블
                return this.handleDuplicateCase(errorMessage);
            case 1029: // 예기치 않은 토큰
                return this.handleUnexpectedToken(errorMessage);
            case 1031: // 배열 요소가 필요함
                return this.handleArrayElement();
            case 1034: // 'super' 호출이 필요함
                return this.handleSuperRequired();
            case 1036: // 'new.target'은 생성자에서만 사용 가능
                return this.handleNewTargetContext();
            case 1042: // 'async' 메서드는 'await' 식만 반환 가능
                return this.handleAsyncAwaitReturn();
            case 1044: // 'yield' 식은 제너레이터 함수 내부에서만 사용 가능
                return this.handleYieldContext();
            case 1055: // 인덱스 시그니처에 명명된 속성 포함 불가
                return this.handleIndexSignatureNamed();
            case 1066: // 'await' 식은 async 함수 내부에서만 사용 가능
                return this.handleAwaitContext();
            case 1068: // 예기치 않은 'super'
                return this.handleUnexpectedSuper();
            case 1071: // 'this' 식은 클래스나 객체 리터럴 내부에서만 사용 가능
                return this.handleThisContext();
            case 1091: // export 식별자는 대문자로 시작해야 함
                return this.handleExportIdentifierCase();
            case 1105: // 'for await..of'는 비동기 이터러블에만 사용 가능
                return this.handleForAwaitOf();
            case 1116: // 'implements', 'extends' 절은 클래스 선언에서만 사용 가능
                return this.handleClassOnlyKeywords();
            case 1119: // 제네릭 타입에 잘못된 구문
                return this.handleInvalidGenericSyntax();
            case 1121: // 참조 앞에 'await' 필요
                return this.handleMissingAwait();
            case 1123: // 제너레이터는 'async' 수정자를 가질 수 없음
                return this.handleAsyncGenerator();
            case 1141: // 문자열 문자로 '`' 예상
                return this.handleExpectedTemplateString();
            case 1147: // 'import' 선언은 모듈의 최상위 레벨에서만 허용
                return this.handleImportLocation();
            case 1163: // 내보낸 변수의 초기화 필요
                return this.handleExportedInitialization();
            case 1164: // 중복된 수정자
                return this.handleDuplicateModifier();
            case 1171: // 메서드 접근자는 'get' 또는 'set'이어야 함
                return this.handleInvalidAccessor();
            case 1172: // 'extends' 절이 필요함
                return this.handleMissingExtends();
            case 1183: // 동적 import에는 하나의 매개변수가 필요
                return this.handleDynamicImportArgument();
            default:
                return explanation;
        }
    }
    private handleForAwaitOf(): ErrorExplanation {
        return {
            title: 'for await...of 구문 오류',
            description: 'for await...of는 비동기 이터러블(AsyncIterable)에만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '올바른 사용',
                    code: `// 올바른 사용
    async function processItems() {
        const asyncIterable = getAsyncIterable();
        for await (const item of asyncIterable) {
            console.log(item);
        }
    }
    
    // 일반 이터러블의 경우
    for (const item of iterable) {
        console.log(item);
    }`
                }
            ]
        };
    }
    
    private handleClassOnlyKeywords(): ErrorExplanation {
        return {
            title: '클래스 전용 키워드 오류',
            description: "'implements'와 'extends' 키워드는 클래스 선언에서만 사용할 수 있습니다.",
            solutions: [
                {
                    title: '클래스 선언에서 사용',
                    code: `// 올바른 사용
    class Child extends Parent {
        // 클래스 내용
    }
    
    class Implementation implements Interface {
        // 인터페이스 구현
    }`
                },
                {
                    title: '인터페이스 확장',
                    code: `// 인터페이스는 extends 사용 가능
    interface ChildInterface extends ParentInterface {
        // 인터페이스 정의
    }`
                }
            ]
        };
    }
    
    private handleInvalidGenericSyntax(): ErrorExplanation {
        return {
            title: '잘못된 제네릭 구문',
            description: '제네릭 타입 매개변수가 올바르지 않은 형식으로 사용되었습니다.',
            solutions: [
                {
                    title: '올바른 제네릭 구문',
                    code: `// 올바른 사용
    class Container<T> {
        value: T;
    }
    
    // 함수에서의 사용
    function identity<T>(arg: T): T {
        return arg;
    }
    
    // 인터페이스에서의 사용
    interface Box<T> {
        contents: T;
    }`
                },
                {
                    title: '제약 조건 추가',
                    code: `// 제네릭 제약 조건
    interface Lengthwise {
        length: number;
    }
    
    function loggingIdentity<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);
        return arg;
    }`
                }
            ]
        };
    }
    
    private handleMissingAwait(): ErrorExplanation {
        return {
            title: 'await 키워드 누락',
            description: 'Promise를 반환하는 함수 호출 앞에 await 키워드가 필요합니다.',
            solutions: [
                {
                    title: 'await 추가',
                    code: `async function example() {
        // 잘못된 사용
        const result = someAsyncFunction();
    
        // 올바른 사용
        const result = await someAsyncFunction();
    }`
                },
                {
                    title: 'Promise 체이닝 사용',
                    code: `// Promise 체이닝을 사용하는 경우
    someAsyncFunction()
        .then(result => {
            // 결과 처리
        })
        .catch(error => {
            // 에러 처리
        });`
                }
            ]
        };
    }
    
    private handleAsyncGenerator(): ErrorExplanation {
        return {
            title: 'async 제너레이터 오류',
            description: '제너레이터 함수는 async 수정자를 가질 수 없습니다.',
            solutions: [
                {
                    title: '일반 제너레이터 사용',
                    code: `// 올바른 제너레이터
    function* numberGenerator() {
        yield 1;
        yield 2;
        yield 3;
    }`
                },
                {
                    title: 'async 함수 사용',
                    code: `// 비동기 작업이 필요한 경우
    async function asyncFunction() {
        const result = await someAsyncOperation();
        return result;
    }`
                }
            ]
        };
    }
    private handleExpectedTemplateString(): ErrorExplanation {
        return {
            title: '템플릿 문자열 구문 오류',
            description: '템플릿 리터럴은 반드시 백틱(`)으로 감싸야 합니다.',
            solutions: [
                {
                    title: '일반적인 템플릿 리터럴 사용',
                    code: `// 잘못된 사용
    const greeting = 'Hello, \\\${name}';  // 작은따옴표는 템플릿 리터럴로 동작하지 않음
    const info = "나이: \\\${age}";   // 큰따옴표도 템플릿 리터럴로 동작하지 않음
    
    // 올바른 사용
    const greeting = \`Hello, \\\${name}\`;  // 백틱을 사용해야 함
    const info = \`나이: \\\${age}\`;  // 백틱으로 감싸야 동작함`
                },
                {
                    title: '여러 줄 템플릿 리터럴',
                    code: `// 여러 줄 문자열과 변수 삽입
    const message = \`
        이름: \\\${name}
        나이: \\\${age}
        직업: \\\${job}
    \`;`
                },
                {
                    title: '표현식 포함하기',
                    code: `// 템플릿 리터럴 내에서 표현식 사용
    const message = \`
        합계: \\\${price * quantity}
        평균: \\\${total / count}
        결과: \\\${getValue()}
    \`;`
                }
            ]
        };
    }
    
    private handleImportLocation(): ErrorExplanation {
        return {
            title: 'import 위치 오류',
            description: 'import 선언은 모듈의 최상위 레벨에서만 허용됩니다.',
            solutions: [
                {
                    title: '최상위 레벨 import',
                    code: `// 올바른 사용
    import { something } from './module';
    
    // 함수 내부에서 필요한 경우 동적 import 사용
    async function loadModule() {
        const module = await import('./module');
    }`
                }
            ]
        };
    }
    
    private handleExportedInitialization(): ErrorExplanation {
        return {
            title: '내보낸 변수 초기화 필요',
            description: 'export된 변수는 반드시 초기화되어야 합니다.',
            solutions: [
                {
                    title: '초기화와 함께 export',
                    code: `// 잘못된 사용
    export let value;
    
    // 올바른 사용
    export const value = 42;
    export let counter = 0;`
                },
                {
                    title: '선언 후 export',
                    code: `// 선언과 초기화 후 export
    let value = 42;
    export { value };`
                }
            ]
        };
    }
    
    private handleDuplicateModifier(): ErrorExplanation {
        return {
            title: '중복된 수정자',
            description: '동일한 수정자(public, private 등)를 중복해서 사용할 수 없습니다.',
            solutions: [
                {
                    title: '중복 제거',
                    code: `// 잘못된 사용
    public public method() {}
    
    // 올바른 사용
    public method() {}
    
    // 클래스 멤버
    class Example {
        private readonly value: number;
    }`
                }
            ]
        };
    }
    
    private handleInvalidAccessor(): ErrorExplanation {
        return {
            title: '잘못된 접근자 메서드',
            description: '접근자 메서드는 반드시 "get" 또는 "set"이어야 합니다.',
            solutions: [
                {
                    title: '올바른 접근자 사용',
                    code: `class Example {
        private _value: string;
    
        // getter
        get value(): string {
            return this._value;
        }
    
        // setter
        set value(newValue: string) {
            this._value = newValue;
        }
    }`
                }
            ]
        };
    }
    
    private handleMissingExtends(): ErrorExplanation {
        return {
            title: 'extends 절 누락',
            description: '클래스나 인터페이스 상속 시 extends 절이 필요합니다.',
            solutions: [
                {
                    title: '클래스 상속',
                    code: `// 올바른 클래스 상속
    class Parent {}
    class Child extends Parent {
        // 자식 클래스 구현
    }`
                },
                {
                    title: '인터페이스 상속',
                    code: `// 올바른 인터페이스 상속
    interface Parent {
        prop: string;
    }
    interface Child extends Parent {
        additionalProp: number;
    }`
                }
            ]
        };
    }
    
    private handleDynamicImportArgument(): ErrorExplanation {
        return {
            title: '동적 import 인수 오류',
            description: '동적 import()는 정확히 하나의 문자열 인수가 필요합니다.',
            solutions: [
                {
                    title: '올바른 동적 import',
                    code: `// 올바른 사용
    const module = await import('./module');
    
    // 변수 사용
    const modulePath = './module';
    const module = await import(modulePath);
    
    // 잘못된 사용
    // await import();  // 인수 없음
    // await import('./module1', './module2');  // 여러 인수`
                },
                {
                    title: '조건부 import',
                    code: `// 조건에 따른 동적 import
    const moduleName = condition ? 'module1' : 'module2';
    const module = await import(\`./\${moduleName}\`);`
                }
            ]
        };
    }
    private handleUnexpectedEndToken(errorMessage: string): ErrorExplanation {
        const token = errorMessage.match(/'([^']+)'/)?.[1] || '';
        return {
            title: '파일 끝에 예기치 않은 토큰',
            description: `파일 끝에 예기치 않은 토큰 '${token}'이(가) 있습니다.`,
            solutions: [
                {
                    title: '중괄호/괄호 짝 맞추기',
                    code: `// 올바른 괄호 짝 맞추기
    function example() {
        if (condition) {
            // 코드
        } // if 블록 닫기
    } // 함수 블록 닫기`
                },
                {
                    title: '불필요한 토큰 제거',
                    code: `// 불필요한 토큰 제거
    const obj = {
        prop: value
    }; // 세미콜론은 선택사항`
                }
            ]
        };
    }
    
    private handleNestedTemplate(): ErrorExplanation {
        return {
            title: '중첩된 템플릿 표현식 불가',
            description: '템플릿 리터럴 내에서 다른 템플릿 리터럴을 중첩할 수 없습니다.',
            solutions: [
                {
                    title: '표현식 분리',
                    code: `// 잘못된 사용
    const nested = \`템플릿 \${하위\`중첩\`}\`;
    
    // 올바른 사용
    const inner = \`중첩\`;
    const outer = \`템플릿 \${inner}\`;`
                },
                {
                    title: '문자열 연결 사용',
                    code: `const result = \`첫 번째 부분 \${value}\` + 
                 \` 두 번째 부분\`;`
                }
            ]
        };
    }
    
    private handleDuplicateCase(errorMessage: string): ErrorExplanation {
        return {
            title: '중복된 case 레이블',
            description: 'switch 문에서 동일한 case 레이블을 여러 번 사용할 수 없습니다.',
            solutions: [
                {
                    title: '중복 제거',
                    code: `switch (value) {
        case 1:
            // 첫 번째 case 처리
            break;
        case 2: // 각 case는 고유해야 함
            // 두 번째 case 처리
            break;
    }`
                },
                {
                    title: '케이스 병합',
                    code: `switch (value) {
        case 1:
        case 2: // 여러 case에 대해 동일한 처리
            // 공통 처리
            break;
    }`
                }
            ]
        };
    }
    
    private handleUnexpectedToken(errorMessage: string): ErrorExplanation {
        const token = errorMessage.match(/'([^']+)'/)?.[1] || '';
        return {
            title: '예기치 않은 토큰',
            description: `'${token}' 토큰이 이 위치에 올 수 없습니다.`,
            solutions: [
                {
                    title: '올바른 구문 사용',
                    code: `// 잘못된 구문 예시
    if (condition) {
        statement;
    } else else { // 중복된 else
    
    // 올바른 구문
    if (condition) {
        statement;
    } else {
        // 다른 처리
    }`
                }
            ]
        };
    }
    
    private handleArrayElement(): ErrorExplanation {
        return {
            title: '배열 요소 필요',
            description: '배열 리터럴에는 유효한 요소가 필요합니다.',
            solutions: [
                {
                    title: '올바른 배열 요소 추가',
                    code: `// 잘못된 사용
    const arr = [,,,]; // 빈 슬롯만 있음
    
    // 올바른 사용
    const arr = [1, 2, 3];
    // 또는
    const arr = Array(3).fill(null);`
                }
            ]
        };
    }
    
    private handleSuperRequired(): ErrorExplanation {
        return {
            title: 'super() 호출 필요',
            description: '파생 클래스의 생성자는 반드시 super()를 호출해야 합니다.',
            solutions: [
                {
                    title: 'super 호출 추가',
                    code: `class Parent {
        constructor(param: string) {}
    }
    
    class Child extends Parent {
        constructor(param: string) {
            super(param); // 부모 클래스 생성자 호출
            // 자식 클래스 초기화 코드
        }
    }`
                }
            ]
        };
    }
    
    private handleNewTargetContext(): ErrorExplanation {
        return {
            title: 'new.target 컨텍스트 오류',
            description: 'new.target은 생성자 함수 내부에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '올바른 컨텍스트에서 사용',
                    code: `class Example {
        constructor() {
            if (new.target === Example) {
                console.log('직접 인스턴스화됨');
            }
        }
    }`
                }
            ]
        };
    }
    
    private handleAsyncAwaitReturn(): ErrorExplanation {
        return {
            title: 'async 메서드의 반환값',
            description: 'async 메서드는 Promise를 반환해야 합니다.',
            solutions: [
                {
                    title: 'Promise 반환',
                    code: `async function example() {
        return await someAsyncOperation();
    }
    
    // 또는
    async function example() {
        const result = await someAsyncOperation();
        return result;
    }`
                }
            ]
        };
    }
    
    private handleYieldContext(): ErrorExplanation {
        return {
            title: 'yield 컨텍스트 오류',
            description: 'yield 식은 제너레이터 함수 내부에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '제너레이터 함수 내에서 사용',
                    code: `function* generator() {
        yield 1;
        yield 2;
        yield 3;
    }
    
    // 일반 함수에서는 사용 불가
    function normal() {
        // yield 1; // 에러!
    }`
                }
            ]
        };
    }
    
    private handleIndexSignatureNamed(): ErrorExplanation {
        return {
            title: '인덱스 시그니처 오류',
            description: '인덱스 시그니처에는 명명된 속성을 포함할 수 없습니다.',
            solutions: [
                {
                    title: '별도의 속성 정의',
                    code: `// 잘못된 사용
    interface Wrong {
        [key: string]: string;
        property: string; // 타입이 일치해야 함
    }
    
    // 올바른 사용
    interface Correct {
        [key: string]: string;
        property: string; // 인덱스 시그니처와 같은 타입`
                }
            ]
        };
    }
    
    private handleAwaitContext(): ErrorExplanation {
        return {
            title: 'await 컨텍스트 오류',
            description: 'await 식은 async 함수 내부에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: 'async 함수로 변환',
                    code: `// 잘못된 사용
    function normal() {
        // await promise; // 에러!
    }
    
    // 올바른 사용
    async function correct() {
        await promise;
    }`
                },
                {
                    title: 'IIFE 사용',
                    code: `// 즉시 실행 async 함수
    (async () => {
        await promise;
    })();`
                }
            ]
        };
    }
    
    private handleUnexpectedSuper(): ErrorExplanation {
        return {
            title: '예기치 않은 super 사용',
            description: 'super는 파생 클래스의 메서드 내부에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '올바른 super 사용',
                    code: `class Parent {
        method() {}
    }
    
    class Child extends Parent {
        method() {
            super.method(); // OK
        }
    }`
                }
            ]
        };
    }
    
    private handleThisContext(): ErrorExplanation {
        return {
            title: 'this 컨텍스트 오류',
            description: 'this는 클래스나 객체 리터럴의 메서드 내부에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '화살표 함수 사용',
                    code: `class Example {
        value = 42;
        
        method() {
            // this 바인딩 유지
            const arrow = () => {
                console.log(this.value);
            };
        }
    }`
                },
                {
                    title: 'bind 사용',
                    code: `class Example {
        value = 42;
        
        method() {
            const callback = function() {
                console.log(this.value);
            }.bind(this);
        }
    }`
                }
            ]
        };
    }
    
    private handleExportIdentifierCase(): ErrorExplanation {
        return {
            title: '잘못된 export 식별자',
            description: 'export되는 식별자는 대문자로 시작해야 합니다.',
            solutions: [
                {
                    title: '대문자로 시작하는 이름 사용',
                    code: `// 잘못된 사용
    export const myConstant = 42;
    
    // 올바른 사용
    export const MyConstant = 42;
    export class MyClass {}
    export interface MyInterface {}`
                }
            ]
        };
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