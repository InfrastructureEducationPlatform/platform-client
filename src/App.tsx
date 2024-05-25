import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';

import { BlockEditPage } from './Pages/BlockEditPage.tsx';
import { CreateChannel } from './Pages/CreateChannel';
import { DeploymentListPage } from './Pages/DeploymentListPage.tsx';
import { Home } from './Pages/Home';
import { Join } from './Pages/Join.tsx';
import { Login } from './Pages/Login';
import { LoginCallback } from './Pages/LoginCallback';
import { OnBoarding } from './Pages/Onboarding';
import { OnboardingTour } from './Pages/OnboardingTour.tsx';
import { PreferencePage } from './Pages/Preferences.tsx';
import { AuthProvider } from './components/providers/AuthProvider.tsx';

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
        <Route path="/onboardingTour" element={<OnboardingTour />} />
        <Route path="/preferences/*" element={<PreferencePage />} />
        <Route path={'/deployments/*'} element={<DeploymentListPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
