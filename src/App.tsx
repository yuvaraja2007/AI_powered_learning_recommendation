import { useState } from 'react';
import { Brain, Users, Sparkles, BookOpen, BarChart3 } from 'lucide-react';
import { students, courses, interactions } from './data/dummyData';
import { RecommendationEngine } from './algorithms/recommendationEngine';
import { Recommendation, RecommendationMetrics, Student } from './types/learning';
import RecommendationModal from './components/RecommendationModal';
import MetricsVisualization from './components/MetricsVisualization';

function App() {
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [algorithmType, setAlgorithmType] = useState<'collaborative' | 'content_based' | 'hybrid'>('hybrid');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [metrics, setMetrics] = useState<RecommendationMetrics | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const engine = new RecommendationEngine(students, courses, interactions);

  const generateRecommendations = () => {
    setIsLoading(true);

    setTimeout(() => {
      let recs: Recommendation[] = [];

      switch (algorithmType) {
        case 'collaborative':
          recs = engine.collaborativeFiltering(selectedStudent.id, 6);
          break;
        case 'content_based':
          recs = engine.contentBasedFiltering(selectedStudent.id, 6);
          break;
        case 'hybrid':
          recs = engine.hybridRecommendations(selectedStudent.id, 6);
          break;
      }

      const calculatedMetrics = engine.calculateMetrics(selectedStudent.id, recs);

      setRecommendations(recs);
      setMetrics(calculatedMetrics);
      setIsModalOpen(true);
      setIsLoading(false);
    }, 800);
  };

  const studentInteractions = interactions.filter(i => i.studentId === selectedStudent.id);
  const completedCourses = studentInteractions.filter(i => i.completionPercentage === 100).length;
  const avgRating = studentInteractions.filter(i => i.rating).reduce((sum, i) => sum + (i.rating || 0), 0) /
                    studentInteractions.filter(i => i.rating).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AI-Powered Learning Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Personalized course recommendations using collaborative filtering and content-based algorithms
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Select Student</h2>
            </div>
            <select
              value={selectedStudent.id}
              onChange={(e) => setSelectedStudent(students.find(s => s.id === e.target.value)!)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Learning Style:</span>
                <span className="font-medium text-gray-900 capitalize">{selectedStudent.learningStyle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed Courses:</span>
                <span className="font-medium text-gray-900">{completedCourses}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg Rating:</span>
                <span className="font-medium text-gray-900">{avgRating.toFixed(1)} ⭐</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Algorithm</h2>
            </div>

            <div className="space-y-3">
              {[
                { value: 'collaborative', label: 'Collaborative Filtering', desc: 'Based on similar students' },
                { value: 'content_based', label: 'Content-Based', desc: 'Based on course attributes' },
                { value: 'hybrid', label: 'Hybrid Approach', desc: 'Combined algorithms' }
              ].map(algo => (
                <label
                  key={algo.value}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    algorithmType === algo.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="algorithm"
                    value={algo.value}
                    checked={algorithmType === algo.value}
                    onChange={(e) => setAlgorithmType(e.target.value as typeof algorithmType)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{algo.label}</div>
                    <div className="text-xs text-gray-500">{algo.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Dataset Info</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{students.length}</div>
                  <div className="text-xs text-gray-600">Students</div>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                  <div className="text-xs text-gray-600">Courses</div>
                </div>
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{interactions.length}</div>
                  <div className="text-xs text-gray-600">Interactions</div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {metrics && (
          <MetricsVisualization
            metrics={metrics}
            algorithmType={algorithmType === 'collaborative' ? 'Collaborative Filtering' :
                          algorithmType === 'content_based' ? 'Content-Based Filtering' : 'Hybrid Algorithm'}
          />
        )}

        <div className="text-center">
          <button
            onClick={generateRecommendations}
            disabled={isLoading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Personalized Recommendations
              </>
            )}
          </button>
        </div>

        {isModalOpen && recommendations.length > 0 && metrics && (
          <RecommendationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            recommendations={recommendations}
            metrics={metrics}
            studentName={selectedStudent.name}
            algorithmType={algorithmType}
          />
        )}
      </div>
    </div>
  );
}

export default App;
