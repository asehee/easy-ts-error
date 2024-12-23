// src/handlers/typeErrors.ts

import * as vscode from 'vscode';
import { ErrorHandler, ErrorExplanation, Solution } from '../models/types';

export class TypeErrorHandler implements ErrorHandler {
    canHandle(errorCode: number): boolean {
        // 2000-2999 범위의 에러 코드 처리
        return errorCode >= 2000 && errorCode < 3000;
    }

    handle(diagnostic: vscode.Diagnostic): ErrorExplanation {

        console.log('TypeErrorHandler.handle called with diagnostic:', diagnostic);
        
        const errorCode = diagnostic.code as number;
        const errorMessage = diagnostic.message;
        console.log('Processing error code:', errorCode);

        // 기본 설명 객체
        const explanation: ErrorExplanation = {
            title: 'Type Error',
            description: errorMessage,
            solutions: []
        };

        switch (errorCode) {
            case 2300:
                return this.handleDuplicateIdentifier(errorMessage);
            case 2304:
                return this.handleCannotFindName(errorMessage);
            case 2314:
                return this.handleGenericTypeError(errorMessage);
            case 2322:
                return this.handleTypeNotAssignable(errorMessage);
            case 2589:
                return this.handleInfiniteTypeRecursion();
            case 2741:
                return this.handleMissingProperty(errorMessage);
            case 2345:
                return this.handleArgumentTypeError(errorMessage);
            case 2339: // Property does not exist on type
                return this.handlePropertyNotExist(errorMessage);
            case 2352: // Type conversion may be a mistake
                return this.handlePossibleTypeConversionMistake(errorMessage);
            case 2355: // Function must return a value
                return this.handleFunctionMustReturn(errorMessage);
            case 2366: // Function lacks return statement
                return this.handleFunctionLacksReturn(errorMessage);
            case 2384: // Overload signatures must all be ambient or non-ambient
                return this.handleOverloadSignatureAmbient(errorMessage);
            case 2391: // Function implementation is missing
                return this.handleFunctionImplementationMissing(errorMessage);
            case 2394: // Overload signature is not compatible
                return this.handleOverloadSignatureIncompatible(errorMessage);
            case 2416: // Property is not assignable to same property in base type
                return this.handlePropertyNotAssignableToBase(errorMessage);
            case 2420: // Class incorrectly implements interface
                return this.handleClassImplementsInterface(errorMessage);
            case 2428: // All declarations must have identical type parameters
                return this.handleTypeParametersMustMatch(errorMessage);
            case 2448: // Block-scoped variable used before declaration
                return this.handleVariableUsedBeforeDeclaration(errorMessage);
            case 2454: // Variable used before being assigned
                return this.handleVariableUsedBeforeAssignment(errorMessage);
            case 2461: // Type is not an array type
                return this.handleTypeNotArray(errorMessage);
            case 2493: // Tuple type has no element at index
                return this.handleTupleIndexOutOfBounds(errorMessage);
            case 2349: // This expression is not callable
                return this.handleNotCallable(errorMessage);
            case 2367: // This comparison appears to be unintentional
                return this.handleUnintentionalComparison(errorMessage);
            case 2387: // Function overload must not be static
                return this.handleOverloadStatic(diagnostic);
            case 2393: // Duplicate function implementation
                return this.handleDuplicateImplementation(errorMessage);
            case 2451: // Cannot redeclare block-scoped variable
                return this.handleBlockScopedRedeclaration(errorMessage);
            case 2456: // Type alias circularly references itself
                return this.handleCircularTypeAlias();
            case 2462: // A rest element must be last in a destructuring pattern
                return this.handleRestElementLast();
            case 2487: // The left-hand side of a for...of statement cannot use a type annotation
                return this.handleForOfTypeAnnotation();
            case 2554: // Expected arguments, but got none
                return this.handleMissingArguments(errorMessage);
            case 2571: // Object is of type 'unknown'
                return this.handleUnknownType();
            case 2693: // Type instantiation is excessively deep
                return this.handleExcessiveTypeDepth();
            case 2532: // Object possibly undefined
                return this.handlePossiblyUndefined(errorMessage);
            case 2540: // Cannot assign to property as it is read-only
                return this.handleReadOnlyAssignment(errorMessage);
            case 2551: // Property does not exist on type (Did you mean?)
                return this.handlePropertySuggestion(errorMessage);
            case 2578: // Unused type parameter
                return this.handleUnusedTypeParameter(errorMessage);
            case 2739: // Type missing properties
                return this.handleTypeMissingProperties(errorMessage);
            case 2749: // Interface not correctly implemented
                return this.handleInterfaceNotImplemented(errorMessage);
            case 2402: // Async function lacks return type annotation
                return this.handleAsyncReturnType();
            case 2515: // Abstract member not implemented
                return this.handleAbstractMemberNotImplemented(errorMessage);    
            default:
                return explanation;
        }
    }
    private handleExcessiveTypeDepth(): ErrorExplanation {
        return {
            title: '타입 인스턴스화 깊이가 너무 깊음',
            description: '타입의 중첩 깊이가 TypeScript의 제한을 초과했습니다.',
            solutions: [
                {
                    title: '타입 중첩 깊이 제한',
                    code: `// 깊이를 제한한 재귀적 타입 정의
    type RecursiveType<T, D extends number = 5> = D extends 0 
        ? T 
        : { 
            value: T; 
            next?: RecursiveType<T, [-1, 0, 1, 2, 3, 4][D]> 
        };
    
    // 사용 예시
    type LimitedLinkedList = RecursiveType<string>;`
                },
                {
                    title: '인터페이스로 변경',
                    code: `// 재귀적 타입 대신 인터페이스 사용
    interface Node<T> {
        value: T;
        next?: Node<T>;
    }
    
    // 또는 타입 단순화
    type SimpleNode = {
        value: any;
        children?: SimpleNode[];
    };`
                },
                {
                    title: '타입 구조 평탄화',
                    code: `// 중첩된 구조를 평탄화
    type FlattenedType = {
        value: string;
        level1?: string;
        level2?: string;
        level3?: string;
        // 필요한 만큼만 정의
    };`
                }
            ]
        };
    }
    
    private handlePossiblyUndefined(errorMessage: string): ErrorExplanation {
        const objectName = errorMessage.match(/Object is possibly '([^']+)'/)?.[1] || 'undefined';
        const propertyName = errorMessage.match(/property '([^']+)'/)?.[1] || 'property';
        
        return {
            title: '객체가 undefined일 수 있음',
            description: `객체가 '${objectName}'일 수 있어서 안전하지 않은 접근입니다.`,
            solutions: [
                {
                    title: '옵셔널 체이닝 사용',
                    code: `// 안전한 속성 접근
    const value = object?.${propertyName};
    
    // 안전한 메서드 호출
    const result = object?.method?.();
    
    // 기본값과 함께 사용
    const safeValue = object?.${propertyName} ?? defaultValue;`
                },
                {
                    title: 'null 체크 추가',
                    code: `if (object !== undefined && object !== null) {
        // 안전하게 객체 사용
        const value = object.${propertyName};
        // ...
    }`
                },
                {
                    title: 'Type Guard 사용',
                    code: `function isDefined<T>(value: T | undefined | null): value is T {
        return value !== undefined && value !== null;
    }
    
    if (isDefined(object)) {
        // 이 블록 안에서는 object가 undefined/null이 아님이 보장됨
        const value = object.${propertyName};
    }`
                },
                {
                    title: '초기값 보장',
                    code: `// 객체 생성 시점에 초기화 보장
    const object = {
        ${propertyName}: initialValue
    };
    
    // 또는 생성자에서 초기화
    class Example {
        private ${propertyName}: string;
        
        constructor() {
            this.${propertyName} = "초기값";
        }
    }`
                }
            ]
        };
    }
    private handleReadOnlyAssignment(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/property '([^']+)'/)?.[1] || 'property';
        
        return {
            title: '읽기 전용 속성에 할당 시도',
            description: `'${propertyName}' 속성은 읽기 전용이므로 값을 할당할 수 없습니다.`,
            solutions: [
                {
                    title: '읽기 전용 속성 대신 새 객체 생성',
                    code: `// 기존 객체를 수정하는 대신 새 객체 생성
    const newObject = {
        ...originalObject,
        ${propertyName}: newValue
    };`
                },
                {
                    title: 'readonly 제거 고려',
                    code: `interface MutableInterface {
        // readonly 제거
        ${propertyName}: string;
    }`
                },
                {
                    title: '초기화 시점에만 할당',
                    code: `class Example {
        readonly ${propertyName}: string;
    
        constructor(value: string) {
            // 생성자에서는 readonly 속성에 할당 가능
            this.${propertyName} = value;
        }
    }`
                }
            ]
        };
    }
    
    private handlePropertySuggestion(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/property '([^']+)'/)?.[1] || 'property';
        const suggestion = errorMessage.match(/Did you mean '([^']+)'/)?.[1];
        
        return {
            title: '존재하지 않는 속성 접근',
            description: `'${propertyName}' 속성이 존재하지 않습니다.${suggestion ? ` '${suggestion}'를 의도하셨나요?` : ''}`,
            solutions: [
                {
                    title: '제안된 속성 사용',
                    code: `// 잘못된 속성 이름 사용
    object.${propertyName};
    
    // 올바른 속성 이름 사용
    object.${suggestion || 'correctPropertyName'};`
                },
                {
                    title: '속성 추가',
                    code: `interface ExtendedType {
        ${propertyName}: string; // 필요한 속성 추가
    }`
                },
                {
                    title: '타입 가드 사용',
                    code: `interface HasProperty {
        ${propertyName}: string;
    }
    
    function hasProperty(obj: any): obj is HasProperty {
        return '${propertyName}' in obj;
    }
    
    if (hasProperty(object)) {
        console.log(object.${propertyName});
    }`
                }
            ]
        };
    }
    
    private handleUnusedTypeParameter(errorMessage: string): ErrorExplanation {
        const parameterName = errorMessage.match(/Type parameter '([^']+)'/)?.[1] || 'T';
        
        return {
            title: '사용되지 않은 타입 매개변수',
            description: `타입 매개변수 '${parameterName}'가 사용되지 않았습니다.`,
            solutions: [
                {
                    title: '타입 매개변수 사용',
                    code: `// 타입 매개변수 활용
    interface Container<${parameterName}> {
        value: ${parameterName};  // ${parameterName} 사용
        transform(func: (value: ${parameterName}) => ${parameterName}): void;
    }`
                },
                {
                    title: '불필요한 타입 매개변수 제거',
                    code: `// 필요없는 타입 매개변수 제거
    interface SimpleContainer {
        value: string;
    }`
                }
            ]
        };
    }
    
    private handleTypeMissingProperties(errorMessage: string): ErrorExplanation {
        const missingProps = errorMessage.match(/Property '([^']+)'/g)?.map(m => m.match(/'([^']+)'/)![1]) || [];
        
        return {
            title: '타입에 필수 속성이 누락됨',
            description: `타입에 필수적인 속성이 누락되었습니다: ${missingProps.join(', ')}`,
            solutions: [
                {
                    title: '누락된 속성 추가',
                    code: `interface CompleteType {
        ${missingProps.map(prop => `${prop}: any;`).join('\n    ')}
        // 기존 속성들...
    }`
                },
                {
                    title: '속성을 선택적으로 만들기',
                    code: `interface FlexibleType {
        ${missingProps.map(prop => `${prop}?: any;`).join('\n    ')}
        // 기존 속성들...
    }`
                }
            ]
        };
    }
    
    private handleInterfaceNotImplemented(errorMessage: string): ErrorExplanation {
        const interfaceName = errorMessage.match(/interface '([^']+)'/)?.[1] || 'Interface';
        const className = errorMessage.match(/class '([^']+)'/)?.[1] || 'Class';
        
        return {
            title: '인터페이스가 올바르게 구현되지 않음',
            description: `'${className}' 클래스가 '${interfaceName}' 인터페이스를 올바르게 구현하지 않았습니다.`,
            solutions: [
                {
                    title: '누락된 구현 추가',
                    code: `class ${className} implements ${interfaceName} {
        // 필수 속성 구현
        requiredProperty: string = "";
    
        // 필수 메서드 구현
        requiredMethod(): void {
            // 구현 내용
        }
    }`
                },
                {
                    title: '부분 구현을 위한 추상 클래스 사용',
                    code: `abstract class Partial${className} implements ${interfaceName} {
        // 공통 구현
        commonProperty: string = "";
    
        // 하위 클래스에서 구현할 추상 메서드
        abstract abstractMethod(): void;
    }`
                }
            ]
        };
    }
    
    private handleAsyncReturnType(): ErrorExplanation {
        return {
            title: '비동기 함수의 반환 타입 주석 누락',
            description: 'async 함수의 반환 타입이 명시되지 않았습니다.',
            solutions: [
                {
                    title: '명시적 반환 타입 추가',
                    code: `async function fetchData(): Promise<Data> {
        const response = await fetch(url);
        return response.json();
    }`
                },
                {
                    title: '제네릭 타입 사용',
                    code: `async function fetchItems<T>(): Promise<T[]> {
        const response = await fetch(url);
        return response.json();
    }`
                }
            ]
        };
    }
    
    private handleAbstractMemberNotImplemented(errorMessage: string): ErrorExplanation {
        const memberName = errorMessage.match(/member '([^']+)'/)?.[1] || 'member';
        const className = errorMessage.match(/class '([^']+)'/)?.[1] || 'Class';
        
        return {
            title: '추상 멤버가 구현되지 않음',
            description: `'${className}' 클래스에서 추상 멤버 '${memberName}'가 구현되지 않았습니다.`,
            solutions: [
                {
                    title: '추상 멤버 구현',
                    code: `class ${className} extends AbstractClass {
        ${memberName}(): void {
            // 구현 내용 추가
            throw new Error("Method not implemented.");
        }
    }`
                },
                {
                    title: '클래스를 추상 클래스로 변경',
                    code: `abstract class ${className} extends AbstractClass {
        // 추상 멤버로 유지
        abstract ${memberName}(): void;
    }`
                }
            ]
        };
    }
    private handleDuplicateIdentifier(errorMessage: string): ErrorExplanation {
        const duplicateIdentifier = errorMessage.match(/'([^']+)'/)?.[1] || 'unknown';
        return {
            title: `중복된 식별자 '${duplicateIdentifier}'`,
            description: `'${duplicateIdentifier}'가 이미 선언되어 있습니다.`,
            solutions: [
                {
                    title: '식별자 이름 변경',
                    code: `// 다른 이름으로 변경\nconst ${duplicateIdentifier}2 = value;`
                },
                {
                    title: '기존 선언 제거',
                    code: `// 기존 선언을 제거하거나 주석 처리`
                }
            ]
        };
    }
    private handleNotCallable(errorMessage: string): ErrorExplanation {
        const expressionType = errorMessage.match(/Type '([^']+)'/)?.[1] || 'expression';
        
        return {
            title: '호출할 수 없는 표현식',
            description: `타입이 '${expressionType}'인 표현식은 호출할 수 없습니다. 이 타입은 호출 시그니처를 가지고 있지 않습니다.`,
            solutions: [
                {
                    title: '올바른 함수 정의',
                    code: `// 잘못된 사용
    const notFunction = { hello: "world" };
    notFunction(); // 에러!
    
    // 올바른 사용
    const correctFunction = () => { return "hello world"; };
    correctFunction(); // 정상 동작`
                },
                {
                    title: '메서드로 접근',
                    code: `// 객체의 메서드로 정의
    const obj = {
        hello: "world",
        greet() {
            return this.hello;
        }
    };
    obj.greet(); // 객체의 메서드로 호출`
                },
                {
                    title: '호출 가능한 타입 정의',
                    code: `// 호출 시그니처를 가진 타입 정의
    type Callable = {
        (): string;  // 호출 시그니처
        hello: string;  // 속성
    };
    
    // 구현
    const callable: Callable = Object.assign(
        () => "world",
        { hello: "world" }
    );
    
    callable();      // 함수로 호출 가능
    callable.hello;  // 속성 접근 가능`
                }
            ]
        };
    }
    
    private handleUnintentionalComparison(errorMessage: string): ErrorExplanation {
        const type1 = errorMessage.match(/types '([^']+)'/)?.[1];
        const type2 = errorMessage.match(/and '([^']+)'/)?.[1];
        
        return {
            title: '의도하지 않은 타입 비교',
            description: `'${type1}'와 '${type2}' 타입은 서로 겹치는 부분이 없어 비교가 의미가 없습니다.`,
            solutions: [
                {
                    title: '타입 가드 사용',
                    code: `if (typeof value === '${type1}') {
        // ${type1} 타입일 때의 처리
    } else if (typeof value === '${type2}') {
        // ${type2} 타입일 때의 처리
    }`
                },
                {
                    title: '명시적 타입 변환 후 비교',
                    code: `// 명시적 변환 후 비교
    const value1 = String(firstValue);
    const value2 = String(secondValue);
    if (value1 === value2) {
        // 동일한 타입으로 변환 후 비교
    }`
                }
            ]
        };
    }
    
    private handleOverloadStatic(diagnostic: vscode.Diagnostic): ErrorExplanation {
        console.log('handleOverloadStatic called with diagnostic:', diagnostic);
        
        const explanation: ErrorExplanation = {
            title: "Function overload must be static",
            description: "오버로드된 함수의 모든 시그니처는 일관되게 static이거나 non-static이어야 합니다.",
            solutions: [{
                title: "모든 오버로드에 static 추가",
                code: `class Example {
    static overloadedMethod(param: string): string;
    static overloadedMethod(param: number): number;
    static overloadedMethod(param: string | number): string | number {
        return param;
    }
}`
            }]
        };

        console.log('handleOverloadStatic returning:', explanation);
        return explanation;
    }
    
    private handleDuplicateImplementation(errorMessage: string): ErrorExplanation {
        return {
            title: '중복된 함수 구현',
            description: '동일한 함수가 여러 번 구현되었습니다.',
            solutions: [
                {
                    title: '중복 구현 제거',
                    code: `// 하나의 구현만 유지
    function example(a: string): string;
    function example(a: number): number;
    function example(a: string | number): string | number {
        return typeof a === "string" ? a : a.toString();
    }`
                },
                {
                    title: '다른 이름 사용',
                    code: `// 다른 이름으로 분리
    function handleString(a: string): string {
        return a;
    }
    
    function handleNumber(a: number): number {
        return a;
    }`
                }
            ]
        };
    }
    
    private handleBlockScopedRedeclaration(errorMessage: string): ErrorExplanation {
        const variableName = errorMessage.match(/'([^']+)'/)?.[1] || 'variable';
        return {
            title: '블록 스코프 변수 재선언',
            description: `블록 스코프 변수 '${variableName}'를 재선언할 수 없습니다.`,
            solutions: [
                {
                    title: '다른 이름 사용',
                    code: `let ${variableName}1 = firstValue;
    let ${variableName}2 = secondValue;`
                },
                {
                    title: '변수 재할당',
                    code: `let ${variableName} = firstValue;
    ${variableName} = secondValue; // 재선언 대신 재할당`
                }
            ]
        };
    }
    
    private handleCircularTypeAlias(): ErrorExplanation {
        return {
            title: '순환 참조 타입 별칭',
            description: '타입 별칭이 자기 자신을 참조하고 있습니다.',
            solutions: [
                {
                    title: 'interface 사용',
                    code: `// 타입 별칭 대신 interface 사용
    interface Node {
        value: string;
        next?: Node;
    }`
                },
                {
                    title: '간접 참조 사용',
                    code: `type NodeValue = {
        value: string;
    }
    type Node = NodeValue & {
        next?: Node;
    }`
                }
            ]
        };
    }
    
    private handleRestElementLast(): ErrorExplanation {
        return {
            title: 'Rest 요소는 마지막에 위치해야 함',
            description: '구조 분해 패턴에서 rest 요소는 마지막에 있어야 합니다.',
            solutions: [
                {
                    title: 'Rest 요소를 마지막으로 이동',
                    code: `// 배열 구조 분해
    const [first, second, ...rest] = array;
    
    // 객체 구조 분해
    const { prop1, prop2, ...remaining } = object;`
                }
            ]
        };
    }
    
    private handleForOfTypeAnnotation(): ErrorExplanation {
        return {
            title: 'for...of 문의 왼쪽에 타입 주석 사용 불가',
            description: 'for...of 문의 변수 선언에는 타입 주석을 사용할 수 없습니다.',
            solutions: [
                {
                    title: '타입 주석 제거',
                    code: `// 타입 추론 사용
    for (const item of items) {
        // 사용
    }
    
    // 필요한 경우 배열 타입 지정
    const items: string[] = ["a", "b", "c"];
    for (const item of items) {
        // item은 자동으로 string 타입
    }`
                }
            ]
        };
    }
    
    private handleMissingArguments(errorMessage: string): ErrorExplanation {
        const expected = errorMessage.match(/Expected (\d+)/)?.[1] || '필요한';
        return {
            title: '인수 누락',
            description: `이 함수는 ${expected}개의 인수가 필요하지만, 인수가 제공되지 않았습니다.`,
            solutions: [
                {
                    title: '필요한 인수 제공',
                    code: `// 필요한 모든 인수 전달
    function example(a: string, b: number) {
        // ...
    }
    example("text", 42);`
                },
                {
                    title: '선택적 매개변수로 변경',
                    code: `// 매개변수를 선택적으로 만들기
    function example(a?: string, b?: number) {
        // 기본값 처리
        const valueA = a ?? "default";
        const valueB = b ?? 0;
    }`
                }
            ]
        };
    }
    
    private handleUnknownType(): ErrorExplanation {
        return {
            title: 'unknown 타입 객체',
            description: '이 객체는 unknown 타입이므로 직접 사용할 수 없습니다.',
            solutions: [
                {
                    title: '타입 가드 사용',
                    code: `if (typeof value === "string") {
        // value는 string 타입
        console.log(value.toUpperCase());
    } else if (typeof value === "number") {
        // value는 number 타입
        console.log(value.toFixed(2));
    }`
                },
                {
                    title: '타입 단언 사용',
                    code: `// 타입이 확실한 경우에만 사용
    const value = unknownValue as string;
    // 또는
    const value = <string>unknownValue;
    
    // 더 안전한 방법
    if (value instanceof Error) {
        console.log(value.message);
    }`
                }
            ]
        };
    }
    private handleCannotFindName(errorMessage: string): ErrorExplanation {
        const missingIdentifier = errorMessage.match(/Cannot find name '([^']+)'/)?.[1] || 'unknown';
        return {
            title: `'${missingIdentifier}' 를 찾을 수 없음`,
            description: `'${missingIdentifier}' 이름의 변수나 타입을 찾을 수 없습니다.`,
            solutions: [
                {
                    title: '변수 선언',
                    code: `let ${missingIdentifier}: any; // 적절한 타입으로 변경하세요`
                },
                {
                    title: 'import 문 추가',
                    code: `import { ${missingIdentifier} } from './module';`
                }
            ]
        };
    }

    private handleTypeNotAssignable(errorMessage: string): ErrorExplanation {
        const types = this.extractTypeInfo(errorMessage);
        return {
            title: `타입 '${types.sourceType}'을 '${types.targetType}'에 할당할 수 없음`,
            description: `'${types.sourceType}' 타입은 '${types.targetType}' 타입에 할당할 수 없습니다.`,
            solutions: [
                {
                    title: '올바른 타입의 값 사용',
                    code: `// 예시: string 타입에 number를 할당하려 할 때\nlet value: string = "문자열"; // number 대신 string 값 사용`
                },
                {
                    title: '타입 정의 수정',
                    code: `// 타입이 더 넓은 범위를 포함해야 하는 경우\ninterface Example {\n    value: string | number; // 유니온 타입 사용\n}`
                }
            ]
        };
    }

    private handleGenericTypeError(errorMessage: string): ErrorExplanation {
        const genericTypeName = errorMessage.match(/Generic type '([^']+)'/)?.[1] || '';
        return {
            title: `제네릭 타입 '${genericTypeName}'에는 타입 인수가 필요합니다`,
            description: `제네릭 타입은 타입 매개변수를 명시해야 합니다.`,
            solutions: [
                {
                    title: '명시적으로 타입 인수 제공',
                    code: `// 예시\ninterface Container<T> {\n    value: T;\n}\nconst container: Container<string> = {\n    value: "hello"\n};`
                },
                {
                    title: '타입 추론 활용',
                    code: `// 예시: 제네릭 함수 사용\nfunction createContainer<T>(value: T): Container<T> {\n    return { value };\n}\n\n// 타입이 자동으로 추론됨\nconst strContainer = createContainer("hello");`
                }
            ]
        };
    }

    private extractTypeInfo(errorMessage: string): { sourceType?: string; targetType?: string } {
        const sourceType = errorMessage.match(/Type '([^']+)'/)?.[1];
        const targetType = errorMessage.match(/type '([^']+)'/)?.[1];
        return { sourceType, targetType };
    }

    // handleInfiniteTypeRecursion 메서드
    private handleInfiniteTypeRecursion(): ErrorExplanation {
        return {
            title: '무한 타입 중첩 감지',
            description: '타입이 자기 자신을 무한히 참조하고 있습니다.',
            solutions: [
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
            ]
        };
    }

    // handleMissingProperty 메서드
    private handleMissingProperty(errorMessage: string): ErrorExplanation {
        const missingProperty = errorMessage.match(/'([^']+)'/)?.[1];
        const missingType = errorMessage.match(/type '([^']+)'/)?.[1];
        const requiredType = errorMessage.match(/type '([^']+)'$/)?.[1];

        return {
            title: `'${missingProperty}' 속성이 '${missingType}' 타입에 없음`,
            description: `'${missingType}' 타입에 '${requiredType}'에서 요구하는 '${missingProperty}' 속성이 없습니다.`,
            solutions: [
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
            ]
        };
    }

    // handleArgumentTypeError 메서드
    private handleArgumentTypeError(errorMessage: string): ErrorExplanation {
        const argumentType = errorMessage.match(/Argument of type '([^']+)'/)?.[1];
        const parameterType = errorMessage.match(/parameter of type '([^']+)'/)?.[1];

        return {
            title: `'${argumentType}' 타입의 인수를 '${parameterType}' 타입의 매개변수에 할당할 수 없음`,
            description: `'${argumentType}' 타입의 인수는 '${parameterType}' 타입의 매개변수에 할당할 수 없습니다.`,
            solutions: [
                {
                    title: '인수 타입 변경',
                    code: `// 예시: 타입 변환 함수 사용
const convertedValue = ${argumentType}To${parameterType}(originalValue);
functionName(convertedValue);`
                },
                {
                    title: '매개변수 타입 변경',
                    code: `function functionName(param: ${argumentType} | ${parameterType}) {
    // 함수 내용
}`
                }
            ]
        };
    }

    // handlePropertyNotExist 메서드 (2339 에러)
    private handlePropertyNotExist(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/Property '([^']+)'/)?.[1];
        const typeName = errorMessage.match(/type '([^']+)'/)?.[1];

        return {
            title: `'${propertyName}' 속성이 '${typeName}' 타입에 존재하지 않음`,
            description: `'${typeName}' 타입에는 '${propertyName}' 속성이 정의되어 있지 않습니다.`,
            solutions: [
                {
                    title: '인터페이스/타입 확장',
                    code: `interface ${typeName} {
    ${propertyName}: any; // 적절한 타입으로 변경
}`
                },
                {
                    title: '옵셔널 체이닝 사용',
                    code: `// 속성이 있을 수도 있는 경우
const value = obj?.${propertyName}`
                }
            ]
        };
    }

    // handleIncompatibleTypes 메서드 (2367 에러)
    private handleIncompatibleTypes(errorMessage: string): ErrorExplanation {
        const type1 = errorMessage.match(/types '([^']+)'/)?.[1];
        const type2 = errorMessage.match(/and '([^']+)'/)?.[1];

        return {
            title: '호환되지 않는 타입 비교',
            description: `'${type1}'와 '${type2}'는 서로 겹치는 부분이 없어 비교할 수 없습니다.`,
            solutions: [
                {
                    title: '타입 가드 사용',
                    code: `if (typeof value === '${type1}') {
    // ${type1} 타입으로 처리
} else if (typeof value === '${type2}') {
    // ${type2} 타입으로 처리
}`
                },
                {
                    title: '명시적 타입 변환',
                    code: `// 적절한 타입으로 변환 후 비교
const converted = convertTo${type1}(value);
if (converted === expected${type1}Value) {
    // 처리
}`
                }
            ]
        };
    }

    // handleStrictNullChecks 메서드 (2531 에러)
    private handleStrictNullChecks(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/property '([^']+)'/)?.[1] || 'property';

        return {
            title: 'Null 체크 필요',
            description: '엄격한 null 체크에서 이 접근은 안전하지 않습니다.',
            solutions: [
                {
                    title: 'Null 체크 추가',
                    code: `if (obj !== null && obj !== undefined) {
    obj.${propertyName}
}`
                },
                {
                    title: '옵셔널 체이닝 사용',
                    code: `const value = obj?.${propertyName}`
                },
                {
                    title: 'Null 아님 단언 (확실한 경우만)',
                    code: `const value = obj!.${propertyName} // obj가 확실히 null이 아닌 경우만`
                }
            ]
        };
    }

    private handlePossibleTypeConversionMistake(errorMessage: string): ErrorExplanation {
        const sourceType = errorMessage.match(/type '([^']+)'/)?.[1];
        const targetType = errorMessage.match(/type '([^']+)'$/)?.[1];
        
        return {
            title: '타입 변환이 실수일 수 있음',
            description: `'${sourceType}'에서 '${targetType}'으로의 변환이 의도하지 않은 것일 수 있습니다.`,
            solutions: [
                {
                    title: 'unknown을 통한 명시적 변환',
                    code: `const value = (originalValue as unknown) as ${targetType};`
                },
                {
                    title: '타입 변환 함수 사용',
                    code: `function to${targetType}(value: ${sourceType}): ${targetType} {\n    // 적절한 변환 로직 구현\n}`
                }
            ]
        };
    }
    
    private handleFunctionMustReturn(errorMessage: string): ErrorExplanation {
        return {
            title: '함수가 값을 반환해야 함',
            description: '반환 타입이 void가 아닌 함수는 값을 반환해야 합니다.',
            solutions: [
                {
                    title: '반환값 추가',
                    code: `function example(): ReturnType {\n    // 로직\n    return value;\n}`
                },
                {
                    title: 'void 타입으로 변경',
                    code: `function example(): void {\n    // 반환값이 필요없는 경우\n}`
                }
            ]
        };
    }
    
    private handleFunctionLacksReturn(errorMessage: string): ErrorExplanation {
        return {
            title: '함수에 반환문이 없음',
            description: '함수의 실행 경로 중 일부가 값을 반환하지 않습니다.',
            solutions: [
                {
                    title: '누락된 반환문 추가',
                    code: `function example(): string {
        if (condition) {
            return "value";
        }
        return "default"; // 누락된 반환문 추가
    }`
                },
                {
                    title: '조건부 반환에 else 추가',
                    code: `function example(): string {
        if (condition) {
            return "value1";
        } else {
            return "value2";
        }
    }`
                }
            ]
        };
    }
    private handleOverloadSignatureAmbient(errorMessage: string): ErrorExplanation {
        return {
            title: '오버로드 시그니처 불일치',
            description: '모든 오버로드 시그니처는 ambient이거나 non-ambient여야 합니다.',
            solutions: [
                {
                    title: '모든 시그니처를 ambient로 통일',
                    code: `declare function example(a: string): string;
    declare function example(a: number): number;`
                },
                {
                    title: '모든 시그니처를 non-ambient로 통일',
                    code: `function example(a: string): string;
    function example(a: number): number;
    function example(a: string | number): string | number {
        return typeof a === "string" ? a : a.toString();
    }`
                }
            ]
        };
    }
    private handleFunctionImplementationMissing(errorMessage: string): ErrorExplanation {
        return {
            title: '함수 구현 누락',
            description: '선언된 함수의 구현이 없습니다.',
            solutions: [
                {
                    title: '함수 구현 추가',
                    code: `function example(a: string): string;
    function example(a: number): number;
    function example(a: string | number): string | number {
        // 구현 추가
        return typeof a === "string" ? a : a.toString();
    }`
                },
                {
                    title: 'declare 키워드로 선언만 하기',
                    code: `// 외부 구현을 사용할 경우
    declare function example(a: string): string;
    declare function example(a: number): number;`
                }
            ]
        };
    }
    private handleOverloadSignatureIncompatible(errorMessage: string): ErrorExplanation {
        return {
            title: '오버로드 시그니처 불일치',
            description: '오버로드 시그니처가 구현 시그니처와 호환되지 않습니다.',
            solutions: [
                {
                    title: '구현 시그니처 수정',
                    code: `function example(a: string): string;
    function example(a: number): number;
    function example(a: string | number): string | number {
        // 모든 오버로드를 처리할 수 있는 구현
        return typeof a === "string" ? a : a.toString();
    }`
                },
                {
                    title: '오버로드 시그니처 수정',
                    code: `// 구현과 일치하도록 오버로드 수정
    function example(a: string | number): string;
    function example(a: any): string {
        return String(a);
    }`
                }
            ]
        };
    }
    private handleClassImplementsInterface(errorMessage: string): ErrorExplanation {
        const className = errorMessage.match(/Class '([^']+)'/)?.[1] || 'Class';
        const interfaceName = errorMessage.match(/interface '([^']+)'/)?.[1] || 'Interface';
    
        return {
            title: `클래스가 인터페이스를 잘못 구현함`,
            description: `'${className}' 클래스가 '${interfaceName}' 인터페이스를 올바르게 구현하지 않았습니다.`,
            solutions: [
                {
                    title: '누락된 멤버 구현',
                    code: `interface ${interfaceName} {
        property: string;
        method(): void;
    }
    
    class ${className} implements ${interfaceName} {
        property: string = ""; // 필요한 속성 구현
        method(): void {
            // 메서드 구현
        }
    }`
                },
                {
                    title: '타입 일치시키기',
                    code: `class ${className} implements ${interfaceName} {
        // 인터페이스와 정확히 일치하는 타입으로 구현
        property: string;
        method(): void {
            // 구현
        }
    }`
                }
            ]
        };
    }
    
    private handlePropertyNotAssignableToBase(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/Property '([^']+)'/)?.[1] || 'property';
        
        return {
            title: '베이스 타입과 속성 타입 불일치',
            description: '파생 클래스의 속성이 베이스 클래스의 동일 속성과 타입이 일치하지 않습니다.',
            solutions: [
                {
                    title: '파생 클래스 속성 타입 수정',
                    code: `class Base {
        prop: string = "";
    }
    class Derived extends Base {
        prop: string = ""; // 베이스 클래스와 동일한 타입 사용
    }`
                },
                {
                    title: '더 구체적인 타입으로 제한',
                    code: `class Base {
        prop: string | number = "";
    }
    class Derived extends Base {
        prop: string = ""; // 더 구체적인 타입으로 제한 가능
    }`
                }
            ]
        };
    }
    private handleTypeParametersMustMatch(errorMessage: string): ErrorExplanation {
        return {
            title: '타입 매개변수 불일치',
            description: '모든 선언의 타입 매개변수가 동일해야 합니다.',
            solutions: [
                {
                    title: '타입 매개변수 통일',
                    code: `interface Example<T> {
        value: T;
    }
    
    // 동일한 타입 매개변수 사용
    interface Example<T> {
        getValue(): T;
    }`
                },
                {
                    title: '제네릭 타입 일치시키기',
                    code: `class Container<T> {
        value: T;
    }
    
    // 확장 시 동일한 타입 매개변수 사용
    class SpecialContainer<T> extends Container<T> {
        extra: T;
    }`
                }
            ]
        };
    }
    
    private handleVariableUsedBeforeDeclaration(errorMessage: string): ErrorExplanation {
        const variableName = errorMessage.match(/variable '([^']+)'/)?.[1] || 'variable';
    
        return {
            title: '선언 전 변수 사용',
            description: `블록 스코프 변수 '${variableName}'가 선언되기 전에 사용되었습니다.`,
            solutions: [
                {
                    title: '변수 선언 위치 이동',
                    code: `// 변수를 사용하기 전에 선언
    let ${variableName} = value;
    console.log(${variableName});`
                },
                {
                    title: '변수 호이스팅 고려',
                    code: `// var는 호이스팅되지만 권장되지 않음
    // let이나 const 사용을 권장
    let ${variableName};
    if (condition) {
        ${variableName} = value;
    }`
                }
            ]
        };
    }
    private handleVariableUsedBeforeAssignment(errorMessage: string): ErrorExplanation {
        const variableName = errorMessage.match(/Variable '([^']+)'/)?.[1] || 'variable';
    
        return {
            title: '할당 전 변수 사용',
            description: `변수 '${variableName}'가 값이 할당되기 전에 사용되었습니다.`,
            solutions: [
                {
                    title: '초기값 할당',
                    code: `let ${variableName} = initialValue; // 초기값 지정
    // 이후 사용`
                },
                {
                    title: '조건부 사용 시 확인 로직 추가',
                    code: `let ${variableName}: string | undefined;
    // ...
    if (${variableName} !== undefined) {
        console.log(${variableName});
    }`
                }
            ]
        };
    }
    private handleTypeNotArray(errorMessage: string): ErrorExplanation {
        const typeName = errorMessage.match(/type '([^']+)'/)?.[1] || 'Type';
    
        return {
            title: '배열 타입이 아님',
            description: `'${typeName}' 타입은 배열 타입이 아닙니다.`,
            solutions: [
                {
                    title: '배열 타입으로 선언',
                    code: `// 배열 타입 선언
    const arr: ${typeName}[] = [value1, value2];
    // 또는
    const arr: Array<${typeName}> = [value1, value2];`
                },
                {
                    title: '반복 가능한 타입으로 변환',
                    code: `// 반복 가능한 객체로 변환
    const iterable: Iterable<${typeName}> = {
        *[Symbol.iterator]() {
            yield value1;
            yield value2;
        }
    };`
                }
            ]
        };
    }
    private handleTupleIndexOutOfBounds(errorMessage: string): ErrorExplanation {
        const indexMatch = errorMessage.match(/index (\d+)/);
        const index = indexMatch ? indexMatch[1] : '?';
    
        return {
            title: '튜플 인덱스 범위 초과',
            description: `튜플에서 존재하지 않는 인덱스 ${index}에 접근하려고 했습니다.`,
            solutions: [
                {
                    title: '튜플 정의 수정',
                    code: `// 필요한 모든 요소를 포함하도록 튜플 정의
    type ValidTuple = [string, number, boolean];
    const tuple: ValidTuple = ["text", 42, true];`
                },
                {
                    title: '옵셔널 요소 사용',
                    code: `// 선택적 요소를 포함한 튜플
    type FlexibleTuple = [string, number, boolean?];
    const tuple: FlexibleTuple = ["text", 42];`
                }
            ]
        };
    }
    
}