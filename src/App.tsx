import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';

import { BlockEditPage } from './Pages/BlockEditPage.tsx';
import { CreateChannel } from './Pages/CreateChannel';
import { Home } from './Pages/Home';
import { Join } from './Pages/Join';
import { Login } from './Pages/Login';
import { LoginCallback } from './Pages/LoginCallback';
import { OnBoarding } from './Pages/Onboarding';
import { AuthProvider } from './components/providers/AuthProvider.tsx';
import { OnboardingTour } from './Pages/OnboardingTour.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<LoginCallback />} />
        <Route path="/register" element={<Join />} />
        <Route
          path="/createChannel"
          element={
            <AuthProvider>
              <CreateChannel />
            </AuthProvider>
          }
        />
        <Route
          path="/onBoarding"
          element={
            <AuthProvider>
              <OnBoarding />
            </AuthProvider>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path={'/sketches/:sketchId'} element={<BlockEditPage />} />
        <Route path='/onboardingTour' element={<OnboardingTour/>}/>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
