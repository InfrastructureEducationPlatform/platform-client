import { InputRuledProps, checkInput } from "./InputUtils";

// Form.Item의 rules의 validator에서 input의 값을 검증
// 값에 따라 Form 제출을 reject, resolve할 수 있음.
export const validateInput = ({ ...props }: InputRuledProps) => {
    const checkResult = checkInput({ ...props });
    console.log(checkResult);
    if (checkResult.status === 'error') {
        return Promise.reject(checkResult.message);
    } else {
        return Promise.resolve();
    }
};

// Input 형태 정의
export const validationConfig = {
    channelName: {
        maxLength: 40,
        minLength: 1,
        type: 'string'
    },
    channelDescription: {
        maxLength: 200,
        minLength: 1,
        type: 'string'
    },
    channelProfileImg: {
        type: 'image'
    },
    userName: {
        maxLength: 40,
        minLength: 1,
        type: 'string'
    },
    userEmail: {
        maxLength: 320,
        minLength: 1,
        type: 'email'
    },
    userImg: {
        type: 'image'
    },
    sketchName: {
        maxLength: 40,
        minLength: 1,
        type: 'string'
    },
    sketchDescription: {
        maxLength: 300,
        minLength: 1,
        type: 'string'
    },
    blockTitle: {
        maxLength: 20,
        minLength: 1,
        type: 'string'
    },
    blockDescription: {
        maxLength: 200,
        minLength: 1,
        type: 'string'
    },
    "aws-static-AccessKey": {
        maxLength: 40,
        type: 'string'
    },
    "aws-static-SecretKey": {
        maxLength: 40,
        type: 'string'
    },
    "aws-static-Region": {
        maxLength: 30,
        type: 'string'
    },
    "azure-static-ClientId": {
        maxLength: 60,
        type: 'string'
    },
    "azure-static-ClientSecret": {
        maxLength: 60,
        type: 'string'
    },
    "azure-static-SubscriptionId": {
        maxLength: 60,
        type: 'string'
    },
    "azure-static-TenantId": {
        maxLength: 60,
        type: 'string'
    },
    "azure-static-Region": {
        maxLength: 40,
        type: 'string'
    },
    searchInput:{
        maxLength: 200,
        type: 'string'
    }
};