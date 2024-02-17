import { notification } from 'antd';
import axios from 'axios';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ErrorResponse } from '../../libs/core-api/api';
import { ErrorMap } from '../../utils/ErrorMap.tsx';

interface ErrorContextValue {
  showError: (error: unknown) => void;
}

interface ErrorHandlerProviderProps {
  children: ReactNode;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorHandlerProvider({ children }: ErrorHandlerProviderProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [api, contextHolder] = notification.useNotification();

  const showError = (error: unknown) => {
    if (!error) return;

    // Handle Error
    let errorMessage = `요청 도중 문제가 발생했습니다: ${JSON.stringify(
      error,
    )}`;

    if (error instanceof Error) {
      errorMessage = convertErrorToMessage(error) ?? '';
    }

    setError(errorMessage);
  };

  useEffect(() => {
    if (error) {
      api['error']({
        message: 'Error occurred',
        description: error,
        duration: 3,
        onClose: () => setError(undefined),
      });
    }
  }, [api, error]);

  return (
    <ErrorContext.Provider value={{ showError }}>
      <>
        {contextHolder}
        {children}
      </>
    </ErrorContext.Provider>
  );
}

export const useErrorHandler = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within a ErrorProvider');
  }
  return context;
};

function convertErrorToMessage(error: unknown) {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    console.error('not an axios error or ErrorResponse', error);
    return '알 수 없는 에러가 발생했습니다.';
  }

  if (error.response === undefined) {
    console.error('no response', error);
    return '알 수 없는 에러가 발생했습니다.(errorResponse 타입이지만, 실제 응답이 없습니다.)';
  }

  const errorTitle = error.response.data.errorTitle ?? '';
  return ErrorMap[errorTitle] ?? errorTitle;
}
