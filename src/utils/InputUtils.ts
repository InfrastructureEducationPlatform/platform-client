import { InputStatus } from "antd/es/_util/statusUtils";

export type InputRuledProps = {
    type: string,
    value?: string,
    maxLength?: number,
    minLength?: number,
    placeholder?:string,
}

export type ErrorType = 'length_min' | 'length_max' | 'type_err';

export type CheckInputType = {
    status: InputStatus,
    errorType?: ErrorType,
    message: string,
}
// 조건에 맞는 input인지 확인하는 함수
export const checkInput = ({ ...props }: InputRuledProps): CheckInputType => {
    // 최소 길이 확인
    if (props.minLength && props.value!.length < props.minLength) {
        return { status: 'error', errorType: 'length_min', message: `최소 ${props.minLength}자 이상 입력해주세요.` }
    }
    else if (props.maxLength && props.value!.length > props.maxLength) {
        return { status: 'error', errorType: 'length_max', message: `최대 ${props.maxLength}자 이하로 입력해주세요.` };
    }

    // length 확인이 완료된 경우, type 확인
    // type 확인
    
    // 모든 조건을 충족하는 경우
    return typeCheck(props.value!, props.type);
}

const typeCheck = (value: string, type: string): CheckInputType => {
    var result:CheckInputType = { status: '', message: '' };
    switch (type) {
        case 'number':
            if (isNaN(Number(value))) {
                result = { status: 'error', message: '숫자만 입력해주세요.' };
            }
            break;
        case 'email':
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                result = { status: 'error', message: '이메일 형식으로 입력해주세요.(ex : abc@kangdroid.com)' };
            }
            break;
        case 'string':
            const stringRegex = /^[a-zA-Z가-힣0-9\s]*$/;
            if (!stringRegex.test(value)) {
                result = { status: 'error', message: '특수문자는 입력할 수 없습니다.' };
            }
            break;
        case 'english':
            const englishRegex = /^[a-zA-Z]*$/;
            if (!englishRegex.test(value)) {
                result = { status: 'error', message: '영어만 입력해주세요.' };
            }
            break;
        default:
            result = { status: '', message: '' };
    }

    if(result!.status === 'error')
        result.errorType = 'type_err';

    return result;
}