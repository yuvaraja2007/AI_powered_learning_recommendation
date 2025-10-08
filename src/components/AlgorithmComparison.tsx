import { TrendingUp, Layers, Zap, Award } from 'lucide-react';
import { Recommendation, RecommendationMetrics } from '../types/learning';

interface AlgorithmComparisonProps {
  collaborativeRecs: Recommendation[];
  contentBasedRecs: Recommendation[];
  hybridRecs: Recommendation[];
  collaborativeMetrics: RecommendationMetrics;
  contentBasedMetrics: RecommendationMetrics;
  hybridMetrics: RecommendationMetrics;
  onSelectAlgorithm: (type: 'collaborative' | 'content_based' | 'hybrid') => void;
}

export default function AlgorithmComparison({
  collaborativeRecs,
  contentBasedRecs,
  hybridRecs,
  collaborativeMetrics,
  contentBasedMetrics,
  hybridMetrics,
  onSelectAlgorithm
}: AlgorithmComparisonProps) {
  const algorithms = [
    {
      type: 'collaborative' as const,
      name: 'Collaborative Filtering',
      description: 'Learns from similar students',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      recommendations: collaborativeRecs,
      metrics: collaborativeMetrics
    },
    {
      type: 'content_based' as const,
      name: 'Content-Based',
      description: 'Matches your interests',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      recommendations: contentBasedRecs,
      metrics: contentBasedMetrics
    },
    {
      type: 'hybrid' as const,
      name: 'Hybrid Algorithm',
      description: 'Best of both approaches',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      recommendations: hybridRecs,
      metrics: hybridMetrics,
      recommended: true
    }
  ];

  const getOverallScore = (metrics: RecommendationMetrics) => {
    return ((metrics.accuracy + metrics.precision + metrics.recall + metrics.coverage + metrics.diversity) / 5 * 100).toFixed(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-2xl">
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
        Compare Algorithm Performance
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Select the algorithm that works best for your learning style
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {algorithms.map((algo) => (
          <div
            key={algo.type}
            className={`relative border-2 ${algo.borderColor} rounded-xl p-6 transition-all hover:shadow-xl cursor-pointer transform hover:scale-105`}
            onClick={() => onSelectAlgorithm(algo.type)}
          >
            {algo.recommended && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                RECOMMENDED
              </div>
            )}

            <div className={`${algo.bgColor} ${algo.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {algo.icon}
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              {algo.name}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              {algo.description}
            </p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Score</span>
                <span className={`text-2xl font-bold ${algo.textColor}`}>
                  {getOverallScore(algo.metrics)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${algo.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${getOverallScore(algo.metrics)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <MetricBar label="Accuracy" value={algo.metrics.accuracy} />
              <MetricBar label="Precision" value={algo.metrics.precision} />
              <MetricBar label="Recall" value={algo.metrics.recall} />
              <MetricBar label="Coverage" value={algo.metrics.coverage} />
              <MetricBar label="Diversity" value={algo.metrics.diversity} />
            </div>

            <div className={`${algo.bgColor} rounded-lg p-3 mb-4`}>
              <p className="text-xs font-medium text-gray-700 mb-1">Top Recommendations:</p>
              <div className="space-y-1">
                {algo.recommendations.slice(0, 2).map((rec, i) => (
                  <p key={i} className="text-xs text-gray-600 truncate">
                    {i + 1}. {rec.course.title}
                  </p>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-3 bg-gradient-to-r ${algo.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 w-20">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gray-600 transition-all duration-500"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-700 font-medium w-10 text-right">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}
