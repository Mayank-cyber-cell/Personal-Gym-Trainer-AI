import { useFitness } from '@/contexts/FitnessContext';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import Dashboard from './Dashboard';

const Index = () => {
  const { isOnboarded } = useFitness();

  if (!isOnboarded) {
    return <OnboardingForm />;
  }

  return <Dashboard />;
};

export default Index;
