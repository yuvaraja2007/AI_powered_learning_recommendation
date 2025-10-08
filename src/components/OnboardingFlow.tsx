import { useState } from 'react';
import { User, Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: {
    name: string;
    learningStyle: string;
    interests: string[];
  }) => void;
}

const AVAILABLE_INTERESTS = [
  'programming', 'data-science', 'machine-learning', 'web-development',
  'ui-design', 'mobile', 'statistics', 'python', 'javascript', 'react',
  'ai', 'neural-networks', 'nlp', 'backend', 'fullstack', 'frontend'
];

const LEARNING_STYLES = [
  {
    value: 'visual',
    label: 'Visual Learner',
    description: 'I learn best through diagrams, charts, and visual demonstrations',
    icon: '👁️'
  },
  {
    value: 'auditory',
    label: 'Auditory Learner',
    description: 'I prefer listening to lectures and verbal explanations',
    icon: '👂'
  },
  {
    value: 'kinesthetic',
    label: 'Kinesthetic Learner',
    description: 'I learn by doing hands-on projects and practical exercises',
    icon: '✋'
  },
  {
    value: 'reading',
    label: 'Reading/Writing Learner',
    description: 'I prefer reading documentation and taking written notes',
    icon: '📖'
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = () => {
    if (name && learningStyle && selectedInterests.length >= 3) {
      onComplete({ name, learningStyle, interests: selectedInterests });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length >= 2;
      case 2:
        return learningStyle !== '';
      case 3:
        return selectedInterests.length >= 3;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
        <div className="relative h-3 bg-gray-200">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">
                Welcome to Your Learning Journey
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Let's personalize your experience. What's your name?
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">
                What's Your Learning Style?
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Help us tailor recommendations to how you learn best
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setLearningStyle(style.value)}
                    className={`p-6 border-3 rounded-xl text-left transition-all transform hover:scale-105 ${
                      learningStyle === style.value
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-4xl mb-3">{style.icon}</div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      {style.label}
                    </h3>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">
                What Interests You?
              </h2>
              <p className="text-center text-gray-600 mb-2">
                Select at least 3 topics you'd like to learn about
              </p>
              <p className="text-center text-sm text-blue-600 font-medium mb-6">
                {selectedInterests.length} selected
              </p>
              <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto p-2">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-5 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                      selectedInterests.includes(interest)
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                    {selectedInterests.includes(interest) && (
                      <span className="ml-2">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Started
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
