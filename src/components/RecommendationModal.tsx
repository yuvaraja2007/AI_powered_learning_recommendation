import { X, TrendingUp, Target, Layers, BookOpen, Clock, Star } from 'lucide-react';
import { Recommendation, RecommendationMetrics } from '../types/learning';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Recommendation[];
  metrics: RecommendationMetrics;
  studentName: string;
  algorithmType: 'collaborative' | 'content_based' | 'hybrid';
}

export default function RecommendationModal({
  isOpen,
  onClose,
  recommendations,
  metrics,
  studentName,
  algorithmType
}: RecommendationModalProps) {
  if (!isOpen) return null;

  const algorithmNames = {
    collaborative: 'Collaborative Filtering',
    content_based: 'Content-Based Filtering',
    hybrid: 'Hybrid Algorithm'
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Personalized Learning Recommendations</h2>
            <p className="text-blue-100">For {studentName}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-1.5">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">{algorithmNames[algorithmType]}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 gap-4 mb-8">
            <MetricCard
              icon={<Target className="w-5 h-5" />}
              label="Accuracy"
              value={`${(metrics.accuracy * 100).toFixed(0)}%`}
              color="bg-blue-50 text-blue-600"
            />
            <MetricCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Precision"
              value={`${(metrics.precision * 100).toFixed(0)}%`}
              color="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
              icon={<Target className="w-5 h-5" />}
              label="Recall"
              value={`${(metrics.recall * 100).toFixed(0)}%`}
              color="bg-purple-50 text-purple-600"
            />
            <MetricCard
              icon={<Layers className="w-5 h-5" />}
              label="Coverage"
              value={`${(metrics.coverage * 100).toFixed(0)}%`}
              color="bg-amber-50 text-amber-600"
            />
            <MetricCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Diversity"
              value={`${(metrics.diversity * 100).toFixed(0)}%`}
              color="bg-rose-50 text-rose-600"
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recommended Courses ({recommendations.length})
            </h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={rec.course.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg font-bold text-lg">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">
                        {rec.course.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {rec.course.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.course.difficultyLevel)}`}>
                          {rec.course.difficultyLevel}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {rec.course.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.course.durationMinutes} min
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.course.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold text-lg">
                        {(rec.score * 5).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Match Score
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 italic">
                    💡 {rec.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
      <div className={`${color} rounded-full p-3 mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-600 font-medium">{label}</div>
    </div>
  );
}
