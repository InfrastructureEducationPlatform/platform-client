import { notification } from 'antd';
import axios from 'axios';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

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
    console.error(error);

    // Handle Error
    let errorMessage = `요청 도중 문제가 발생했습니다: ${JSON.stringify(
      error,
    )}`;

    if (error instanceof Error) {
      errorMessage = error.message;
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
