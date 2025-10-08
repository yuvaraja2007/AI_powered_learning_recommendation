import { RecommendationMetrics } from '../types/learning';
import { TrendingUp, Award, Target } from 'lucide-react';

interface MetricsVisualizationProps {
  metrics: RecommendationMetrics;
  algorithmType: string;
}

export default function MetricsVisualization({ metrics, algorithmType }: MetricsVisualizationProps) {
  const metricsData = [
    { label: 'Accuracy', value: metrics.accuracy, color: 'bg-blue-500' },
    { label: 'Precision', value: metrics.precision, color: 'bg-emerald-500' },
    { label: 'Recall', value: metrics.recall, color: 'bg-purple-500' },
    { label: 'Coverage', value: metrics.coverage, color: 'bg-amber-500' },
    { label: 'Diversity', value: metrics.diversity, color: 'bg-rose-500' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Algorithm Performance Metrics
        </h3>
        <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {algorithmType}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-8">
        {metricsData.map(metric => (
          <div key={metric.label} className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - metric.value)}`}
                  className={metric.color.replace('bg-', 'text-')}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">
                  {Math.round(metric.value * 100)}%
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InsightCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Overall Quality"
          value={`${Math.round((metrics.accuracy + metrics.precision) / 2 * 100)}%`}
          description="Combined accuracy and precision score"
          color="bg-blue-50 text-blue-600"
        />
        <InsightCard
          icon={<Target className="w-5 h-5" />}
          title="User Coverage"
          value={`${Math.round(metrics.recall * 100)}%`}
          description="Percentage of relevant items found"
          color="bg-emerald-50 text-emerald-600"
        />
        <InsightCard
          icon={<Award className="w-5 h-5" />}
          title="Recommendation Spread"
          value={`${Math.round(metrics.diversity * 100)}%`}
          description="Variety across different categories"
          color="bg-purple-50 text-purple-600"
        />
      </div>
    </div>
  );
}

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: string;
}

function InsightCard({ icon, title, value, description, color }: InsightCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className={`${color} rounded-full p-2 w-fit mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
}
