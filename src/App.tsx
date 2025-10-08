import { useState } from 'react';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';
import { courses } from './data/dummyData';
import { RecommendationEngine } from './algorithms/recommendationEngine';
import { Recommendation, RecommendationMetrics, Student, StudentInteraction } from './types/learning';
import OnboardingFlow from './components/OnboardingFlow';
import CourseInteractionPanel from './components/CourseInteractionPanel';
import AlgorithmComparison from './components/AlgorithmComparison';
import RecommendationModal from './components/RecommendationModal';
import MetricsVisualization from './components/MetricsVisualization';
import ExportPanel from './components/ExportPanel';

type AppStage = 'onboarding' | 'course-selection' | 'results';

function App() {
  const [stage, setStage] = useState<AppStage>('onboarding');
  const [userProfile, setUserProfile] = useState<Student | null>(null);
  const [userInteractions, setUserInteractions] = useState<StudentInteraction[]>([]);

  const [collaborativeRecs, setCollaborativeRecs] = useState<Recommendation[]>([]);
  const [contentBasedRecs, setContentBasedRecs] = useState<Recommendation[]>([]);
  const [hybridRecs, setHybridRecs] = useState<Recommendation[]>([]);

  const [collaborativeMetrics, setCollaborativeMetrics] = useState<RecommendationMetrics | null>(null);
  const [contentBasedMetrics, setContentBasedMetrics] = useState<RecommendationMetrics | null>(null);
  const [hybridMetrics, setHybridMetrics] = useState<RecommendationMetrics | null>(null);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'collaborative' | 'content_based' | 'hybrid'>('hybrid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOnboardingComplete = (profile: { name: string; learningStyle: string; interests: string[] }) => {
    const student: Student = {
      id: `user-${Date.now()}`,
      name: profile.name,
      email: `${profile.name.toLowerCase().replace(' ', '.')}@student.com`,
      learningStyle: profile.learningStyle as any,
      interests: profile.interests
    };
    setUserProfile(student);
    setStage('course-selection');
  };

  const handleInteractionsComplete = (interactions: StudentInteraction[]) => {
    setUserInteractions(interactions);
    setIsGenerating(true);

    setTimeout(() => {
      const allStudents = [userProfile!];
      const allInteractions = interactions;
      const engine = new RecommendationEngine(allStudents, courses, allInteractions);

      const collabRecs = engine.collaborativeFiltering(userProfile!.id, 6);
      const contentRecs = engine.contentBasedFiltering(userProfile!.id, 6);
      const hybridRecsResult = engine.hybridRecommendations(userProfile!.id, 6);

      setCollaborativeRecs(collabRecs);
      setContentBasedRecs(contentRecs);
      setHybridRecs(hybridRecsResult);

      setCollaborativeMetrics(engine.calculateMetrics(userProfile!.id, collabRecs));
      setContentBasedMetrics(engine.calculateMetrics(userProfile!.id, contentRecs));
      setHybridMetrics(engine.calculateMetrics(userProfile!.id, hybridRecsResult));

      setIsGenerating(false);
      setStage('results');
    }, 2000);
  };

  const handleViewDetails = (type: 'collaborative' | 'content_based' | 'hybrid') => {
    setSelectedAlgorithm(type);
    setIsModalOpen(true);
  };

  const handleRestart = () => {
    setStage('onboarding');
    setUserProfile(null);
    setUserInteractions([]);
    setCollaborativeRecs([]);
    setContentBasedRecs([]);
    setHybridRecs([]);
    setCollaborativeMetrics(null);
    setContentBasedMetrics(null);
    setHybridMetrics(null);
  };

  const getRecommendationsForAlgorithm = () => {
    switch (selectedAlgorithm) {
      case 'collaborative':
        return collaborativeRecs;
      case 'content_based':
        return contentBasedRecs;
      case 'hybrid':
        return hybridRecs;
    }
  };

  const getMetricsForAlgorithm = () => {
    switch (selectedAlgorithm) {
      case 'collaborative':
        return collaborativeMetrics!;
      case 'content_based':
        return contentBasedMetrics!;
      case 'hybrid':
        return hybridMetrics!;
    }
  };

  if (stage === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <Brain className="w-12 h-12 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              AI is Analyzing Your Profile
            </h2>
            <p className="text-gray-600 mb-4">
              Processing {userInteractions.length} course interactions...
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Running collaborative filtering algorithm
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                Analyzing content-based patterns
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                Computing hybrid recommendations
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {stage === 'course-selection' && (
          <div className="animate-fadeIn">
            <header className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Welcome back, {userProfile?.name}!
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Select courses you've explored to get personalized recommendations
              </p>
            </header>

            <div className="max-w-5xl mx-auto">
              <CourseInteractionPanel
                courses={courses}
                onInteractionComplete={handleInteractionsComplete}
                currentStudentId={userProfile!.id}
              />
            </div>
          </div>
        )}

        {stage === 'results' && (
          <div className="animate-fadeIn">
            <header className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Your Personalized Learning Path
                </h1>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                AI-powered recommendations based on your interests and learning style
              </p>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </button>
            </header>

            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{userProfile?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Learning Style</p>
                      <p className="font-semibold text-gray-900 capitalize">{userProfile?.learningStyle}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile?.interests.map(interest => (
                          <span
                            key={interest}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Courses Explored</p>
                      <p className="font-semibold text-gray-900">{userInteractions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                      <p className="font-semibold text-gray-900">
                        {(userInteractions.reduce((sum, i) => sum + (i.rating || 0), 0) / userInteractions.length).toFixed(1)} ⭐
                      </p>
                    </div>
                  </div>
                </div>

                <ExportPanel
                  recommendations={hybridRecs}
                  metrics={hybridMetrics!}
                  studentName={userProfile!.name}
                  algorithmType="Hybrid Algorithm"
                />
              </div>

              {hybridMetrics && (
                <MetricsVisualization
                  metrics={hybridMetrics}
                  algorithmType="Hybrid Algorithm (Recommended)"
                />
              )}

              {collaborativeMetrics && contentBasedMetrics && hybridMetrics && (
                <AlgorithmComparison
                  collaborativeRecs={collaborativeRecs}
                  contentBasedRecs={contentBasedRecs}
                  hybridRecs={hybridRecs}
                  collaborativeMetrics={collaborativeMetrics}
                  contentBasedMetrics={contentBasedMetrics}
                  hybridMetrics={hybridMetrics}
                  onSelectAlgorithm={handleViewDetails}
                />
              )}
            </div>
          </div>
        )}

        {isModalOpen && (
          <RecommendationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            recommendations={getRecommendationsForAlgorithm()}
            metrics={getMetricsForAlgorithm()}
            studentName={userProfile!.name}
            algorithmType={selectedAlgorithm}
          />
        )}
      </div>
    </div>
  );
}

export default App;
