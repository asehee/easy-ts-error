// src/handlers/typeErrors.ts

import * as vscode from 'vscode';
import { ErrorHandler, ErrorExplanation, Solution } from '../models/types';

export class TypeErrorHandler implements ErrorHandler {
    canHandle(errorCode: number): boolean {
        // 2000-2999 범위의 에러 코드 처리
        return errorCode >= 2000 && errorCode < 3000;
    }

    handle(diagnostic: vscode.Diagnostic): ErrorExplanation {
        const errorCode = diagnostic.code as number;
        const errorMessage = diagnostic.message;

        // 기본 설명 객체
        const explanation: ErrorExplanation = {
            title: 'Type Error',
            description: errorMessage,
            detail: '',
            solutions: []
        };

        switch (errorCode) {
            case 2300:
                return this.handleDuplicateIdentifier(errorMessage);
            case 2304:
                return this.handleCannotFindName(errorMessage);
            case 2322:
                return this.handleTypeNotAssignable(errorMessage);
            case 2314:
                return this.handleGenericTypeError(errorMessage);
            case 2589:
                return this.handleInfiniteTypeRecursion();
            case 2741:
                return this.handleMissingProperty(errorMessage);
            case 2345:
                return this.handleArgumentTypeError(errorMessage);
            default:
                return explanation;
        }
    }

    private handleDuplicateIdentifier(errorMessage: string): ErrorExplanation {
        const duplicateIdentifier = errorMessage.match(/'([^']+)'/)?.[1] || 'unknown';
        return {
            title: `중복된 식별자 '${duplicateIdentifier}'`,
            description: `'${duplicateIdentifier}'가 이미 선언되어 있습니다.`,
            detail: '',
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

    private handleCannotFindName(errorMessage: string): ErrorExplanation {
        const missingIdentifier = errorMessage.match(/Cannot find name '([^']+)'/)?.[1] || 'unknown';
        return {
            title: `'${missingIdentifier}' 를 찾을 수 없음`,
            description: `'${missingIdentifier}' 이름의 변수나 타입을 찾을 수 없습니다.`,
            detail: '',
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
            detail: '',
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
            detail: '',
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
            detail: '',
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
            detail: '',
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
            detail: '',
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
            detail: '',
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
            detail: '',
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
            detail: '',
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
}