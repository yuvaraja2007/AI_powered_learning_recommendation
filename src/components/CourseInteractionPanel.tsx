import { useState } from 'react';
import { Star, Clock, BookOpen, TrendingUp, Check, Eye } from 'lucide-react';
import { Course, StudentInteraction } from '../types/learning';

interface CourseInteractionPanelProps {
  courses: Course[];
  onInteractionComplete: (interactions: StudentInteraction[]) => void;
  currentStudentId: string;
}

export default function CourseInteractionPanel({
  courses,
  onInteractionComplete,
  currentStudentId
}: CourseInteractionPanelProps) {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [courseRatings, setCourseRatings] = useState<Map<string, number>>(new Map());
  const [courseCompletion, setCourseCompletion] = useState<Map<string, number>>(new Map());
  const [currentPage, setCurrentPage] = useState(0);

  const COURSES_PER_PAGE = 4;
  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  const currentCourses = courses.slice(
    currentPage * COURSES_PER_PAGE,
    (currentPage + 1) * COURSES_PER_PAGE
  );

  const toggleCourse = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
      const newRatings = new Map(courseRatings);
      newRatings.delete(courseId);
      setCourseRatings(newRatings);
      const newCompletion = new Map(courseCompletion);
      newCompletion.delete(courseId);
      setCourseCompletion(newCompletion);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const updateRating = (courseId: string, rating: number) => {
    const newRatings = new Map(courseRatings);
    newRatings.set(courseId, rating);
    setCourseRatings(newRatings);
  };

  const updateCompletion = (courseId: string, completion: number) => {
    const newCompletion = new Map(courseCompletion);
    newCompletion.set(courseId, completion);
    setCourseCompletion(newCompletion);
  };

  const handleComplete = () => {
    const interactions: StudentInteraction[] = Array.from(selectedCourses).map(courseId => ({
      id: `i-${Date.now()}-${courseId}`,
      studentId: currentStudentId,
      courseId,
      interactionType: (courseCompletion.get(courseId) || 0) >= 100 ? 'complete' : 'rate',
      rating: courseRatings.get(courseId),
      completionPercentage: courseCompletion.get(courseId) || 0,
      timeSpentMinutes: Math.floor(Math.random() * 300) + 60,
      timestamp: new Date()
    }));

    onInteractionComplete(interactions);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const canComplete = selectedCourses.size >= 3 &&
    Array.from(selectedCourses).every(id => courseRatings.has(id) && courseCompletion.has(id));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Courses You've Explored
        </h2>
        <p className="text-gray-600">
          Choose at least 3 courses and rate your experience
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
            {selectedCourses.size} courses selected
          </div>
          {canComplete && (
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              Ready to continue
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {currentCourses.map((course) => {
          const isSelected = selectedCourses.has(course.id);
          const rating = courseRatings.get(course.id);
          const completion = courseCompletion.get(course.id);

          return (
            <div
              key={course.id}
              className={`border-2 rounded-xl p-5 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleCourse(course.id)}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400 hover:border-blue-500'
                  }`}
                >
                  {isSelected ? <Check className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{course.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getDifficultyColor(course.difficultyLevel)}`}>
                      {course.difficultyLevel}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.durationMinutes} min
                    </span>
                  </div>

                  {isSelected && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate this course:
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateRating(course.id, star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  (rating || 0) >= star
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completion: {completion || 0}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={completion || 0}
                          onChange={(e) => updateCompletion(course.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentPage ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>

      <button
        onClick={handleComplete}
        disabled={!canComplete}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        Generate AI Recommendations
      </button>
    </div>
  );
}
