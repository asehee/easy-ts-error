import * as vscode from 'vscode';
import { ErrorHandler, ErrorExplanation } from '../models/types';

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
            case 2300: // Duplicate identifier
                return this.handleDuplicateIdentifier(errorMessage);
            case 2304: // Cannot find name
                return this.handleCannotFindName(errorMessage);
            case 2307: // Cannot find module
                return this.handleCannotFindModule(errorMessage);
            case 2314: // Generic type error
                return this.handleGenericTypeError(errorMessage);
            case 2322: // Type not assignable
                return this.handleTypeNotAssignable(errorMessage);
            case 2339: // Property does not exist on type
                return this.handlePropertyNotExist(errorMessage);
            case 2344: // Type does not implement interface
                return this.handleTypeNotImplementInterface(errorMessage);
            case 2345: // Argument type error
                return this.handleArgumentTypeError(errorMessage);
            case 2348: // Value of type X is not callable
                return this.handleValueNotCallable(errorMessage);
            case 2349: // This expression is not callable
                return this.handleNotCallable(errorMessage);
            case 2351: // Cannot use JSX unless '--jsx' flag is provided
                return this.handleJsxFlagMissing(errorMessage);
            case 2352: // Type conversion may be a mistake
                return this.handlePossibleTypeConversionMistake(errorMessage);
            case 2355: // Function must return a value
                return this.handleFunctionMustReturn(errorMessage);
            case 2362: // The left-hand side of an arithmetic operation must be a number or enum type
                return this.handleArithmeticOperandType(errorMessage);
            case 2365: // Operator cannot be applied to types
                return this.handleInvalidOperatorUsage(errorMessage);
            case 2366: // Function lacks return statement
                return this.handleFunctionLacksReturn(errorMessage);
            case 2367: // This comparison appears to be unintentional
                return this.handleUnintentionalComparison(errorMessage);
            case 2374: // Duplicate number index signature
                return this.handleDuplicateIndexSignature(errorMessage);
            case 2384: // Overload signatures must all be ambient or non-ambient
                return this.handleOverloadSignatureAmbient(errorMessage);
            case 2387: // Function overload must not be static
                return this.handleOverloadStatic(diagnostic);
            case 2391: // Function implementation is missing
                return this.handleFunctionImplementationMissing(errorMessage);
            case 2393: // Duplicate function implementation
                return this.handleDuplicateImplementation(errorMessage);
            case 2394: // Overload signature is not compatible
                return this.handleOverloadSignatureIncompatible(errorMessage);
            case 2402: // Async function lacks return type annotation
                return this.handleAsyncReturnType();
            case 2416: // Property is not assignable to same property in base type
                return this.handlePropertyNotAssignableToBase(errorMessage);
            case 2420: // Class incorrectly implements interface
                return this.handleClassImplementsInterface(errorMessage);
            case 2428: // All declarations must have identical type parameters
                return this.handleTypeParametersMustMatch(errorMessage);
            case 2430: // Interface with multiple call signatures
                return this.handleMultipleCallSignatures(errorMessage);
            case 2432: // Object is possibly 'null'
                return this.handlePossiblyNull(errorMessage);
            case 2445: // Property is missing in type but required in type
                return this.handleMissingRequiredProperty(errorMessage);
            case 2448: // Block-scoped variable used before declaration
                return this.handleVariableUsedBeforeDeclaration(errorMessage);
            case 2451: // Cannot redeclare block-scoped variable
                return this.handleBlockScopedRedeclaration(errorMessage);
            case 2454: // Variable used before being assigned
                return this.handleVariableUsedBeforeAssignment(errorMessage);
            case 2456: // Type alias circularly references itself
                return this.handleCircularTypeAlias();
            case 2459: // Type decorator can only be used in TypeScript files
                return this.handleTypeDecoratorUsage(errorMessage);
            case 2461: // Type is not an array type
                return this.handleTypeNotArray(errorMessage);
            case 2462: // A rest element must be last in a destructuring pattern
                return this.handleRestElementLast();
            case 2463: // Cannot spread object of type 'never'
                return this.handleNeverSpread(errorMessage);
            case 2468: // Cannot find global type
                return this.handleCannotFindGlobalType(errorMessage);
            case 2487: // The left-hand side of a for...of statement cannot use a type annotation
                return this.handleForOfTypeAnnotation();
            case 2493: // Tuple type has no element at index
                return this.handleTupleIndexOutOfBounds(errorMessage);
            case 2496: // The 'this' context of type X is not assignable to method's 'this' of type Y
                return this.handleThisContextMismatch(errorMessage);
            case 2515: // Abstract member not implemented
                return this.handleAbstractMemberNotImplemented(errorMessage);
            case 2531: // Object is possibly 'null' or 'undefined'
                return this.handleNullableAccess(errorMessage);
            case 2532: // Object possibly undefined
                return this.handlePossiblyUndefined(errorMessage);
            case 2533: // Object is possibly 'undefined'
                return this.handlePossiblyUndefinedAccess(errorMessage);
            case 2536: // Type 'X' cannot be used to index type 'Y'
                return this.handleInvalidTypeIndex(errorMessage);
            case 2537: // Type 'X' cannot be used as an index type
                return this.handleNonIndexType(errorMessage);
            case 2538: // Type 'X' cannot be used as an index type
                return this.handleInvalidIndexType(errorMessage);
            case 2540: // Cannot assign to property as it is read-only
                return this.handleReadOnlyAssignment(errorMessage);
            case 2542: // Index signature is missing
                return this.handleMissingIndexSignature(errorMessage);
            case 2551: // Property does not exist on type (Did you mean?)
                return this.handlePropertySuggestion(errorMessage);
            case 2554: // Expected arguments, but got none
                return this.handleMissingArguments(errorMessage);
            case 2571: // Object is of type 'unknown'
                return this.handleUnknownType();
            case 2578: // Unused type parameter
                return this.handleUnusedTypeParameter(errorMessage);
            case 2580: // Type definitions required
                return this.handleRequireTypeDefinitions(errorMessage);
            case 2588: // Cannot reassign constant
                return this.handleConstantReassignment(errorMessage);
            case 2589: // Type recursion
                return this.handleInfiniteTypeRecursion();
            case 2590: // Expression produces a union type that is too complex to represent
                return this.handleComplexUnionType(errorMessage);
            case 2683: // 'this' implicitly has type 'any'
                return this.handleImplicitThisType(errorMessage);
            case 2686: // 'X' refers to a UMD global, but the current file is not a module
                return this.handleUMDGlobalInNonModule(errorMessage);
            case 2689: // Cannot extend an interface 'X'. Did you mean 'implements'?
                return this.handleInterfaceExtensionError(errorMessage);
            case 2693: // Type instantiation is excessively deep
                return this.handleExcessiveTypeDepth();
            case 2701: // 'X' is not assignable to type 'Promise<T>'
                return this.handleInvalidPromiseType(errorMessage);
            case 2739: // Type missing properties
                return this.handleTypeMissingProperties(errorMessage);
            case 2741: // Missing property
                return this.handleMissingProperty(errorMessage);
            case 2742: // The inferred type cannot be named without a reference to 'X'
                return this.handleCircularInference(errorMessage);
            case 2749: // Interface not correctly implemented
                return this.handleInterfaceNotImplemented(errorMessage);
            default:
                return explanation;
        }
    }
    private handleInvalidPromiseType(errorMessage: string): ErrorExplanation {
        const typeMatch = errorMessage.match(/Type '([^']+)'/);
        const invalidType = typeMatch ? typeMatch[1] : '반환된 타입';
    
        return {
            title: '잘못된 Promise 타입',
            description: `'${invalidType}'은(는) 기대하는 Promise 타입과 호환되지 않습니다.`,
            solutions: [
                {
                    title: 'Promise 타입 명시',
                    code: `// 잘못된 사용
    async function wrong(): Promise<string> {
        return 123;  // 에러!
    }
    
    // 올바른 사용
    async function correct(): Promise<string> {
        return "문자열";  // OK
    }`
                },
                {
                    title: 'Promise.resolve 사용',
                    code: `// 명시적 Promise 생성
    function explicit(): Promise<string> {
        return Promise.resolve("문자열");
    }
    
    // 또는 async/await 사용
    async function withAwait(): Promise<string> {
        const result = await someAsyncOperation();
        return result;
    }
    
    // 제네릭 타입 사용
    async function generic<T>(value: T): Promise<T> {
        return value;
    }`
                }
            ]
        };
    }
    
    private handleCircularInference(errorMessage: string): ErrorExplanation {
        const typeMatch = errorMessage.match(/reference to '([^']+)'/);
        const circularType = typeMatch ? typeMatch[1] : '타입';
    
        return {
            title: '순환 참조 타입 추론',
            description: `'${circularType}'에 대한 타입 추론 과정에서 순환 참조가 발생했습니다. 이는 보통 복잡한 제네릭 타입이나 재귀적 타입 정의에서 발생합니다.`,
            solutions: [
                {
                    title: '명시적 타입 선언',
                    code: `// 잘못된 사용 - 타입 추론에 의존
    const circular = {
        self: undefined as any
    };
    circular.self = circular;  // 순환 참조 발생
    
    // 올바른 사용 - 인터페이스 정의
    interface Node {
        self: Node | undefined;
    }
    const node: Node = {
        self: undefined
    };
    node.self = node;  // OK`
                },
                {
                    title: '타입 매개변수 사용',
                    code: `// 제네릭을 사용한 해결
    interface Container<T> {
        value: T;
        next?: Container<T>;
    }
    
    const container: Container<string> = {
        value: "first",
        next: {
            value: "second"
        }
    };`
                },
                {
                    title: '타입 중단점 추가',
                    code: `// 재귀적 타입에 중단점 추가
    type RecursiveType<T> = {
        value: T;
        children: RecursiveType<T>[];
    } | null;  // null을 중단점으로 사용
    
    const tree: RecursiveType<string> = {
        value: "root",
        children: []
    };`
                }
            ]
        };
    }
    private handleNeverSpread(errorMessage: string): ErrorExplanation {
        return {
            title: 'never 타입 spread 오류',
            description: 'never 타입의 객체는 spread 연산자를 사용할 수 없습니다. 이는 보통 타입 추론 과정에서 객체가 never 타입으로 좁혀졌을 때 발생합니다.',
            solutions: [
                {
                    title: '타입 명시',
                    code: `// 잘못된 사용
    const neverObj: never = /* ... */;
    const spread = { ...neverObj };  // 에러!
    
    // 올바른 사용 - 구체적인 타입 지정
    interface MyType {
        prop: string;
    }
    const obj: MyType = { prop: "value" };
    const spread = { ...obj };  // OK`
                },
                {
                    title: '타입 가드 사용',
                    code: `function process(value: string | never) {
        if (typeof value === "string") {
            const obj = { ...{ str: value } };  // OK
        }
    }`
                }
            ]
        };
    }
    
    private handleNullableAccess(errorMessage: string): ErrorExplanation {
        const propertyMatch = errorMessage.match(/property '([^']+)'/);
        const property = propertyMatch ? propertyMatch[1] : 'property';
        
        return {
            title: 'Null 또는 Undefined 접근 오류',
            description: `객체가 null 또는 undefined일 수 있는 상태에서 '${property}' 속성에 접근하려고 했습니다.`,
            solutions: [
                {
                    title: '옵셔널 체이닝 사용',
                    code: `// 잘못된 사용
    const obj: { prop?: string } | null = null;
    console.log(obj.prop);  // 에러!
    
    // 올바른 사용 - 옵셔널 체이닝
    console.log(obj?.prop);  // OK (undefined)`
                },
                {
                    title: '타입 가드 사용',
                    code: `if (obj !== null && obj !== undefined) {
        console.log(obj.prop);  // OK
    }`
                },
                {
                    title: '기본값 설정',
                    code: `// Nullish 병합 연산자 사용
    const value = obj ?? { prop: "기본값" };
    console.log(value.prop);  // OK`
                }
            ]
        };
    }
    
    private handlePossiblyUndefinedAccess(errorMessage: string): ErrorExplanation {
        const propertyMatch = errorMessage.match(/property '([^']+)'/);
        const property = propertyMatch ? propertyMatch[1] : 'property';
    
        return {
            title: 'Undefined 가능성 오류',
            description: `'${property}' 속성이 undefined일 수 있는 상태에서 접근을 시도했습니다.`,
            solutions: [
                {
                    title: '옵셔널 체이닝 사용',
                    code: `// 잘못된 사용
    interface User {
        address?: {
            street: string;
        };
    }
    const user: User = {};
    console.log(user.address.street);  // 에러!
    
    // 올바른 사용
    console.log(user.address?.street);  // OK (undefined)`
                },
                {
                    title: '타입 단언 사용',
                    code: `// 값이 반드시 존재한다고 확신할 경우
    console.log(user.address!.street);  // OK (주의: 런타임 오류 가능)`
                },
                {
                    title: '기본값 설정',
                    code: `const address = user.address ?? { street: "기본 주소" };
    console.log(address.street);  // OK`
                }
            ]
        };
    }
    
    private handleInvalidTypeIndex(errorMessage: string): ErrorExplanation {
        const typeMatch = errorMessage.match(/Type '([^']+)'/);
        const invalidType = typeMatch ? typeMatch[1] : '지정된 타입';
    
        return {
            title: '잘못된 인덱스 타입',
            description: `'${invalidType}' 타입은 객체의 인덱스로 사용할 수 없습니다.`,
            solutions: [
                {
                    title: '올바른 인덱스 타입 사용',
                    code: `// 잘못된 사용
    const obj: { [key: string]: any } = {};
    const complexKey = { key: "value" };
    obj[complexKey];  // 에러!
    
    // 올바른 사용
    const stringKey: string = "key";
    obj[stringKey];  // OK`
                },
                {
                    title: 'Map 사용',
                    code: `// 복잡한 키가 필요한 경우
    const map = new Map<object, any>();
    const complexKey = { key: "value" };
    map.set(complexKey, "value");  // OK`
                }
            ]
        };
    }
    
    private handleNonIndexType(errorMessage: string): ErrorExplanation {
        const typeMatch = errorMessage.match(/Type '([^']+)'/);
        const invalidType = typeMatch ? typeMatch[1] : '지정된 타입';
    
        return {
            title: '사용할 수 없는 인덱스 타입',
            description: `'${invalidType}'는 인덱스 타입으로 사용할 수 없습니다. string, number, 또는 symbol만 사용 가능합니다.`,
            solutions: [
                {
                    title: '문자열 인덱스 사용',
                    code: `interface StringIndex {
        [key: string]: any;
    }
    const obj: StringIndex = {};
    obj["validKey"] = "value";  // OK`
                },
                {
                    title: '숫자 인덱스 사용',
                    code: `interface NumberIndex {
        [index: number]: any;
    }
    const arr: NumberIndex = [];
    arr[0] = "value";  // OK`
                }
            ]
        };
    }
    
    private handleMissingIndexSignature(errorMessage: string): ErrorExplanation {
        return {
            title: '인덱스 시그니처 누락',
            description: '객체에 동적 속성 접근을 위한 인덱스 시그니처가 정의되어 있지 않습니다.',
            solutions: [
                {
                    title: '인덱스 시그니처 추가',
                    code: `// 잘못된 사용
    interface Obj {
        knownProp: string;
    }
    const obj: Obj = { knownProp: "value" };
    obj["dynamicProp"] = "value";  // 에러!
    
    // 올바른 사용
    interface ObjWithIndex {
        knownProp: string;
        [key: string]: string;
    }
    const obj: ObjWithIndex = { knownProp: "value" };
    obj["dynamicProp"] = "value";  // OK`
                },
                {
                    title: 'Record 타입 사용',
                    code: `// Record 유틸리티 타입 사용
    const obj: Record<string, string> = {};
    obj["anyKey"] = "value";  // OK`
                }
            ]
        };
    }
    
    private handleComplexUnionType(errorMessage: string): ErrorExplanation {
        return {
            title: '복잡한 유니온 타입',
            description: '타입 시스템이 처리하기에 너무 복잡한 유니온 타입이 생성되었습니다.',
            solutions: [
                {
                    title: '공통 인터페이스 사용',
                    code: `// 복잡한 유니온 타입
    type Complex = 
        | { type: "A"; propA: string }
        | { type: "B"; propB: number }
        | { type: "C"; propC: boolean };
    
    // 단순화된 버전
    interface Simplified {
        type: string;
        value: any;
    }`
                },
                {
                    title: '타입 그룹화',
                    code: `// 관련된 타입들을 그룹화
    interface BaseType {
        type: string;
    }
    
    interface TypeA extends BaseType {
        type: "A";
        propA: string;
    }
    
    interface TypeB extends BaseType {
        type: "B";
        propB: number;
    }`
                }
            ]
        };
    }
    
    private handleImplicitThisType(errorMessage: string): ErrorExplanation {
        return {
            title: '암시적 this 타입',
            description: '함수 내에서 this의 타입이 명시적으로 지정되지 않았습니다.',
            solutions: [
                {
                    title: 'this 타입 명시',
                    code: `// 잘못된 사용
    class Example {
        private value: number = 0;
        
        callback() {
            setTimeout(function() {
                this.value++;  // 에러!
            });
        }
    }
    
    // 올바른 사용
    class Example {
        private value: number = 0;
        
        callback() {
            setTimeout(() => {
                this.value++;  // OK
            });
        }
    }`
                },
                {
                    title: 'this 매개변수 사용',
                    code: `class Example {
        private value: number = 0;
        
        increment(this: Example) {
            this.value++;  // OK
        }
    }`
                }
            ]
        };
    }
    
    private handleUMDGlobalInNonModule(errorMessage: string): ErrorExplanation {
        const moduleMatch = errorMessage.match(/'([^']+)'/);
        const moduleName = moduleMatch ? moduleMatch[1] : 'module';
    
        return {
            title: 'UMD 전역 모듈 참조 오류',
            description: `'${moduleName}'은 UMD 전역 모듈이지만, 현재 파일이 모듈로 인식되지 않습니다.`,
            solutions: [
                {
                    title: '모듈 선언 추가',
                    code: `// 파일을 모듈로 만들기
    export {};  // 빈 export
    
    // 이후 UMD 모듈 사용 가능
    import * as Module from '${moduleName}';`
                },
                {
                    title: '타입 선언 참조',
                    code: `/// <reference types="${moduleName}" />
    
    // 또는
    import type { SomeType } from '${moduleName}';`
                }
            ]
        };
    }
    
    private handleInterfaceExtensionError(errorMessage: string): ErrorExplanation {
        const interfaceMatch = errorMessage.match(/interface '([^']+)'/);
        const interfaceName = interfaceMatch ? interfaceMatch[1] : 'Interface';
    
        return {
            title: '잘못된 인터페이스 확장',
            description: `'${interfaceName}' 인터페이스를 잘못된 방식으로 확장하려고 했습니다.`,
            solutions: [
                {
                    title: 'implements 키워드 사용',
                    code: `// 잘못된 사용
    class MyClass extends SomeInterface {  // 에러!
        // ...
    }
    
    // 올바른 사용
    class MyClass implements SomeInterface {
        // 인터페이스의 모든 멤버 구현
    }`
                },
                {
                    title: '인터페이스 확장',
                    code: `// 인터페이스 간 확장
    interface BaseInterface {
        prop: string;
    }
    
    interface ExtendedInterface extends BaseInterface {
        additionalProp: number;
    }`
                }
            ]
        };
    }
    private handleInvalidIndexType(errorMessage: string): ErrorExplanation {
        const invalidType = errorMessage.match(/Type '([^']+)'/)?.[1] || '{}';
        
        return {
            title: '잘못된 인덱스 타입 사용',
            description: `'${invalidType}' 타입은 인덱스 타입으로 사용할 수 없습니다. TypeScript에서는 string, number, 또는 Symbol 타입만 객체의 인덱스로 사용할 수 있습니다.`,
            solutions: [
                {
                    title: '문자열 키 사용',
                    code: `// 잘못된 사용
    const key = {};
    const obj = { prop: "value" };
    obj[key];  // 에러!
    
    // 올바른 사용 - 문자열 키
    const stringKey = "prop";
    obj[stringKey];  // OK
    
    // 또는 직접 속성 접근
    obj.prop;  // OK`
                },
                {
                    title: '숫자 키 사용',
                    code: `// 배열이나 튜플의 경우
    const arr = ["a", "b", "c"];
    const index = 0;
    arr[index];  // OK
    
    // 숫자 인덱스 시그니처
    interface NumberIndexed {
        [index: number]: string;
    }`
                },
                {
                    title: 'Symbol 키 사용',
                    code: `// Symbol을 키로 사용
    const symbolKey = Symbol('key');
    const obj = {
        [symbolKey]: "value"
    };
    obj[symbolKey];  // OK`
                },
                {
                    title: 'Map 사용',
                    code: `// 객체를 키로 사용해야 하는 경우 Map 사용
    const key = { id: 1 };
    const map = new Map();
    map.set(key, "value");
    map.get(key);  // OK`
                }
            ]
        };
    }
    private handleConstantReassignment(errorMessage: string): ErrorExplanation {
        const variableName = errorMessage.match(/Cannot assign to '([^']+)'/)?.[1] || 'variable';
    
        return {
            title: '상수 재할당 시도',
            description: `'${variableName}'은 const로 선언되어 재할당할 수 없습니다.`,
            solutions: [
                {
                    title: 'let 키워드 사용',
                    code: `// const 대신 let 사용
    let ${variableName} = initialValue;
    ${variableName} = newValue; // 이제 재할당 가능`
                },
                {
                    title: '객체인 경우 속성 수정',
                    code: `const ${variableName} = { prop: "value" };
    // 객체 자체는 변경할 수 없지만 속성은 변경 가능
    ${variableName}.prop = "new value";
    
    // 또는 새 객체로 전개
    const updated${variableName} = { ...${variableName}, prop: "new value" };`
                },
                {
                    title: '배열인 경우 메서드 사용',
                    code: `const ${variableName} = ["initial"];
    // 배열 자체는 변경할 수 없지만 내용은 변경 가능
    ${variableName}.push("new item");
    ${variableName}[0] = "updated item";
    
    // 또는 새 배열로 전개
    const new${variableName} = [...${variableName}, "new item"];`
                }
            ]
        };
    }
    private handleCannotFindModule(errorMessage: string): ErrorExplanation {
        const moduleName = errorMessage.match(/Cannot find module '([^']+)'/)?.[1] || 'unknown';
        return {
            title: '모듈을 찾을 수 없음',
            description: `'${moduleName}' 모듈을 찾을 수 없습니다.`,
            solutions: [
                {
                    title: '모듈 설치',
                    code: `npm install ${moduleName}

// 타입 정의가 필요한 경우
npm install --save-dev @types/${moduleName}`
                },
                {
                    title: '모듈 경로 확인',
                    code: `// 상대 경로 확인
import { something } from './${moduleName}';
// 또는
import { something } from '../${moduleName}';`
                }
            ]
        };
    }

    private handleTypeNotImplementInterface(errorMessage: string): ErrorExplanation {
        const type = errorMessage.match(/Type '([^']+)'/)?.[1];
        const interfaceName = errorMessage.match(/interface '([^']+)'/)?.[1];

        return {
            title: '인터페이스 구현 누락',
            description: `'${type}' 타입이 '${interfaceName}' 인터페이스를 구현하지 않았습니다.`,
            solutions: [
                {
                    title: '누락된 인터페이스 멤버 구현',
                    code: `interface ${interfaceName} {
    property: string;
    method(): void;
}

class ${type} implements ${interfaceName} {
    property: string = "value";
    method(): void {
        // 구현
    }
}`
                }
            ]
        };
    }

    private handleValueNotCallable(errorMessage: string): ErrorExplanation {
        const type = errorMessage.match(/Value of type '([^']+)'/)?.[1] || 'Type';

        return {
            title: '호출할 수 없는 값',
            description: `'${type}' 타입의 값은 호출할 수 없습니다.`,
            solutions: [
                {
                    title: '함수 타입으로 선언',
                    code: `// 잘못된 사용
const value: ${type} = "not a function";
value(); // 에러!

// 올바른 사용
const value: () => void = () => {
    // 함수 구현
};
value(); // 정상 동작`
                }
            ]
        };
    }

    private handleJsxFlagMissing(errorMessage: string): ErrorExplanation {
        return {
            title: 'JSX 플래그 누락',
            description: 'JSX를 사용하기 위해서는 --jsx 컴파일러 플래그가 필요합니다.',
            solutions: [
                {
                    title: 'tsconfig.json 설정',
                    code: `{
    "compilerOptions": {
        "jsx": "react",
        // 또는
        "jsx": "react-jsx"
    }
}`
                },
                {
                    title: '명령줄 옵션',
                    code: `tsc --jsx react`
                }
            ]
        };
    }

    private handleArithmeticOperandType(errorMessage: string): ErrorExplanation {
        return {
            title: '잘못된 산술 연산자 사용',
            description: '산술 연산의 피연산자는 숫자나 열거형 타입이어야 합니다.',
            solutions: [
                {
                    title: '숫자로 변환',
                    code: `// 잘못된 사용
const result = "123" + 456; // 문자열 연결

// 올바른 사용
const result = Number("123") + 456; // 산술 연산
// 또는
const result = parseInt("123") + 456;`
                }
            ]
        };
    }

    private handleInvalidOperatorUsage(errorMessage: string): ErrorExplanation {
        const operator = errorMessage.match(/operator '([^']+)'/)?.[1] || 'operator';

        return {
            title: '연산자 사용 불가',
            description: `이 타입들에는 '${operator}' 연산자를 사용할 수 없습니다.`,
            solutions: [
                {
                    title: '타입 변환 후 연산',
                    code: `// 잘못된 사용
const result = value1 ${operator} value2;

// 올바른 사용
const num1 = Number(value1);
const num2 = Number(value2);
const result = num1 ${operator} num2;`
                }
            ]
        };
    }

    private handleDuplicateIndexSignature(errorMessage: string): ErrorExplanation {
        return {
            title: '중복된 인덱스 시그니처',
            description: '숫자 인덱스 시그니처가 중복 정의되었습니다.',
            solutions: [
                {
                    title: '단일 인덱스 시그니처 사용',
                    code: `// 잘못된 정의
interface Wrong {
    [index: number]: string;
    [x: number]: string;  // 중복!
}

// 올바른 정의
interface Correct {
    [index: number]: string;
}`
                }
            ]
        };
    }

    private handleMultipleCallSignatures(errorMessage: string): ErrorExplanation {
        return {
            title: '다중 호출 시그니처',
            description: '인터페이스에 여러 호출 시그니처가 정의되었습니다.',
            solutions: [
                {
                    title: '오버로드 사용',
                    code: `interface Callable {
    (arg: string): string;
    (arg: number): number;
}

const implementation: Callable = (arg: string | number): string | number => {
    return typeof arg === "string" ? arg : arg.toString();
};`
                }
            ]
        };
    }

    private handlePossiblyNull(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/property '([^']+)'/)?.[1] || 'property';

        return {
            title: '널 가능성 있는 객체 접근',
            description: '객체가 null일 수 있어 안전하지 않은 접근입니다.',
            solutions: [
                {
                    title: 'null 체크 추가',
                    code: `if (object !== null) {
    object.${propertyName}; // 안전한 접근
}`
                },
                {
                    title: '옵셔널 체이닝 사용',
                    code: `const value = object?.${propertyName};`
                },
                {
                    title: 'Null 아님 단언 (확실한 경우만)',
                    code: `const value = object!.${propertyName};`
                }
            ]
        };
    }

    private handleMissingRequiredProperty(errorMessage: string): ErrorExplanation {
        const propertyName = errorMessage.match(/Property '([^']+)'/)?.[1] || 'property';

        return {
            title: '필수 속성 누락',
            description: `'${propertyName}' 속성이 필수지만 구현에서 누락되었습니다.`,
            solutions: [
                {
                    title: '필수 속성 추가',
                    code: `interface Required {
    ${propertyName}: string;
}

const implementation: Required = {
    ${propertyName}: "value"  // 필수 속성 추가
};`
                }
            ]
        };
    }

    private handleTypeDecoratorUsage(errorMessage: string): ErrorExplanation {
        return {
            title: '타입 데코레이터 사용 제한',
            description: '타입 데코레이터는 TypeScript 파일에서만 사용할 수 있습니다.',
            solutions: [
                {
                    title: '파일 확장자 변경',
                    code: `// 파일 이름을 .ts 또는 .tsx로 변경
// example.js → example.ts`
                },
                {
                    title: 'tsconfig.json 설정',
                    code: `{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}`
                }
            ]
        };
    }

    private handleCannotFindGlobalType(errorMessage: string): ErrorExplanation {
        const typeName = errorMessage.match(/Cannot find global type '([^']+)'/)?.[1] || 'Type';

        return {
            title: '전역 타입 찾을 수 없음',
            description: `'${typeName}' 전역 타입을 찾을 수 없습니다.`,
            solutions: [
                {
                    title: '타입 정의 설치',
                    code: `npm install --save-dev @types/node
// 또는 필요한 다른 타입 정의 패키지`
                },
                {
                    title: '전역 타입 선언',
                    code: `// 전역 타입 선언 추가
declare global {
    type ${typeName} = {
        // 타입 정의
    }
}`
                }
            ]
        };
    }

    private handleThisContextMismatch(errorMessage: string): ErrorExplanation {
        const expected = errorMessage.match(/of type '([^']+)'/)?.[1] || 'expected type';
        const actual = errorMessage.match(/context of type '([^']+)'/)?.[1] || 'actual type';

        return {
            title: 'this 컨텍스트 불일치',
            description: `메서드의 'this' 타입이 불일치합니다. 예상: ${expected}, 실제: ${actual}`,
            solutions: [
                {
                    title: '화살표 함수 사용',
                    code: `class Example {
    value = "test";
    method = () => {
        // 화살표 함수로 this 바인딩 유지
        console.log(this.value);
    }
}`
                },
                {
                    title: 'bind 사용',
                    code: `class Example {
    constructor() {
        this.method = this.method.bind(this);
    }
    
    method() {
        // this가 올바르게 바인딩됨
    }
}`
                }
            ]
        };
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
    private handleRequireTypeDefinitions(errorMessage: string): ErrorExplanation {
        const typeName = errorMessage.match(/type definitions for ([^?]+)\?/)?.[1] || 'node';
        
        return {
            title: 'require 함수를 찾을 수 없음',
            description: `'require' 함수를 사용하기 위해서는 Node.js의 타입 정의가 필요합니다.`,
            solutions: [
                {
                    title: 'Node.js 타입 정의 설치',
                    code: `npm install --save-dev @types/node`
                },
                {
                    title: 'import 문 사용',
                    code: `// require 대신 import 문 사용
    import * as module from 'module-name';
    // 또는
    import { specific } from 'module-name';`
                },
                {
                    title: 'tsconfig.json에 types 추가',
                    code: `{
        "compilerOptions": {
            "types": ["node"],
            // 다른 설정들...
        }
    }`
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