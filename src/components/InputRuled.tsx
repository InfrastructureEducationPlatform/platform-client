import { Input, Typography, message } from "antd";
import { InputStatus } from "antd/es/_util/statusUtils";
import { max, set } from "lodash";
import { useEffect, useState } from "react";
import { CheckInputType, InputRuledProps, checkInput } from "../utils/InputUtils";
import { SizeType } from "antd/es/config-provider/SizeContext";

// InputRuled 컴포넌트는 antd Input 컴포넌트를 상속받아서 사용합니다.
// Input, Form.Item의 Input 모두에서 사용 가능합니다.

// required한 경우, min_length를 최소 1 이상으로 설정해야합니다.
// required하지 않은 경우 min_length를 0으로 설정하면 됩니다.

// 모든 조건을 충족하는 경우를 ''로 표시합니다.



// 에러 메시지 출력
export const ErrorMessage = ({message}:{message?:string}) => {
    return (
        <div className='ErrorMessage' style={{ minHeight: '2vh', minWidth: '1vw' }}>
            <Typography.Text type={'danger'}>
                {message}
            </Typography.Text>
        </div>
    );
}

export const InputRuled = ({ value = '',callback, style, size,...props }: InputRuledProps&{callback?: (value: string) => void, style?:React.CSSProperties, size?:SizeType}) => {
    const [inputValue, setInputValue] = useState<string>(value);

    // input 상태
    const [status, setStatus] = useState<CheckInputType>({ status: '', message: '' });

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;

        // input 무결성 확인 및 결과에 따른 status 설정
        setStatus(checkInput({ ...props, value: input }));
        console.log(input,status);

        // length가 max를 초과하지 않는 경우에만 input value 설정
        if(status.errorType !== 'length_max'){
            setInputValue(input);
        }

        if(status.status === '' && callback){
            callback(inputValue);
        }
    };

    return (
        <>
            <Input
                status={status.status}
                defaultValue={inputValue}
                count={{ max: props.maxLength, show: true }}
                max={props.maxLength}
                type={props.type}
                onInput={handleInput}
                placeholder={props.placeholder}
                style={style}
                size = {size}
            />
            <ErrorMessage message={status.message}/>
        </>
    );
};

