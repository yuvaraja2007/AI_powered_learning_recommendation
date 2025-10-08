import { Student, Course, StudentInteraction, Recommendation, RecommendationMetrics } from '../types/learning';

export class RecommendationEngine {
  private students: Student[];
  private courses: Course[];
  private interactions: StudentInteraction[];

  constructor(students: Student[], courses: Course[], interactions: StudentInteraction[]) {
    this.students = students;
    this.courses = courses;
    this.interactions = interactions;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return mag1 && mag2 ? dotProduct / (mag1 * mag2) : 0;
  }

  private getUserItemMatrix(): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>();

    this.interactions.forEach(interaction => {
      if (!matrix.has(interaction.studentId)) {
        matrix.set(interaction.studentId, new Map());
      }

      let score = 0;
      if (interaction.rating) {
        score = interaction.rating / 5;
      } else if (interaction.completionPercentage > 0) {
        score = interaction.completionPercentage / 100;
      }

      matrix.get(interaction.studentId)!.set(interaction.courseId, score);
    });

    return matrix;
  }

  collaborativeFiltering(targetStudentId: string, topN: number = 5): Recommendation[] {
    const matrix = this.getUserItemMatrix();
    const targetRatings = matrix.get(targetStudentId);

    if (!targetRatings || targetRatings.size === 0) {
      return this.contentBasedFiltering(targetStudentId, topN);
    }

    const similarities = new Map<string, number>();

    this.students.forEach(student => {
      if (student.id === targetStudentId) return;

      const studentRatings = matrix.get(student.id);
      if (!studentRatings || studentRatings.size === 0) return;

      const commonCourses = Array.from(targetRatings.keys()).filter(courseId =>
        studentRatings.has(courseId)
      );

      if (commonCourses.length < 2) return;

      const vec1 = commonCourses.map(courseId => targetRatings.get(courseId)!);
      const vec2 = commonCourses.map(courseId => studentRatings.get(courseId)!);

      const similarity = this.cosineSimilarity(vec1, vec2);
      if (similarity > 0) {
        similarities.set(student.id, similarity);
      }
    });

    const predictions = new Map<string, { score: number; weight: number }>();

    similarities.forEach((similarity, studentId) => {
      const studentRatings = matrix.get(studentId)!;

      studentRatings.forEach((rating, courseId) => {
        if (targetRatings.has(courseId)) return;

        if (!predictions.has(courseId)) {
          predictions.set(courseId, { score: 0, weight: 0 });
        }

        const pred = predictions.get(courseId)!;
        pred.score += similarity * rating;
        pred.weight += similarity;
      });
    });

    const recommendations: Recommendation[] = [];

    predictions.forEach((pred, courseId) => {
      const course = this.courses.find(c => c.id === courseId);
      if (!course) return;

      const score = pred.weight > 0 ? pred.score / pred.weight : 0;

      recommendations.push({
        course,
        score,
        algorithmType: 'collaborative',
        reasoning: `Based on similar students' preferences (${similarities.size} similar learners found)`
      });
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }

  contentBasedFiltering(targetStudentId: string, topN: number = 5): Recommendation[] {
    const student = this.students.find(s => s.id === targetStudentId);
    if (!student) return [];

    const studentInteractions = this.interactions.filter(i => i.studentId === targetStudentId);
    const viewedCourseIds = new Set(studentInteractions.map(i => i.courseId));

    const availableCourses = this.courses.filter(c => !viewedCourseIds.has(c.id));

    const recommendations: Recommendation[] = availableCourses.map(course => {
      let score = 0;

      const interestMatch = student.interests.filter(interest =>
        course.tags.includes(interest)
      ).length;
      score += interestMatch * 0.3;

      const completedCourses = studentInteractions
        .filter(i => i.completionPercentage > 70)
        .map(i => this.courses.find(c => c.id === i.courseId))
        .filter(c => c !== undefined) as Course[];

      completedCourses.forEach(completedCourse => {
        const tagOverlap = course.tags.filter(tag =>
          completedCourse.tags.includes(tag)
        ).length;
        score += tagOverlap * 0.2;

        if (course.category === completedCourse.category) {
          score += 0.15;
        }
      });

      const avgCompletedLevel = completedCourses.length > 0
        ? completedCourses.map(c =>
            c.difficultyLevel === 'beginner' ? 1 :
            c.difficultyLevel === 'intermediate' ? 2 : 3
          ).reduce((a, b) => a + b, 0) / completedCourses.length
        : 1;

      const courseLevel =
        course.difficultyLevel === 'beginner' ? 1 :
        course.difficultyLevel === 'intermediate' ? 2 : 3;

      const levelDiff = Math.abs(courseLevel - avgCompletedLevel);
      if (levelDiff <= 1) {
        score += 0.2;
      }

      score = Math.min(score, 1);

      return {
        course,
        score,
        algorithmType: 'content_based',
        reasoning: `Matches your interests: ${student.interests.slice(0, 3).join(', ')}`
      };
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }

  hybridRecommendations(targetStudentId: string, topN: number = 5): Recommendation[] {
    const collaborative = this.collaborativeFiltering(targetStudentId, topN * 2);
    const contentBased = this.contentBasedFiltering(targetStudentId, topN * 2);

    const hybridScores = new Map<string, { score: number; course: Course; sources: string[] }>();

    collaborative.forEach(rec => {
      hybridScores.set(rec.course.id, {
        score: rec.score * 0.6,
        course: rec.course,
        sources: ['collaborative']
      });
    });

    contentBased.forEach(rec => {
      if (hybridScores.has(rec.course.id)) {
        const existing = hybridScores.get(rec.course.id)!;
        existing.score += rec.score * 0.4;
        existing.sources.push('content-based');
      } else {
        hybridScores.set(rec.course.id, {
          score: rec.score * 0.4,
          course: rec.course,
          sources: ['content-based']
        });
      }
    });

    const recommendations: Recommendation[] = Array.from(hybridScores.values())
      .map(item => ({
        course: item.course,
        score: item.score,
        algorithmType: 'hybrid' as const,
        reasoning: `Combined approach using ${item.sources.join(' and ')} filtering`
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return recommendations;
  }

  calculateMetrics(studentId: string, recommendations: Recommendation[]): RecommendationMetrics {
    const testInteractions = this.interactions.filter(i =>
      i.studentId === studentId &&
      (i.rating ?? 0) >= 4
    );

    const recommendedIds = new Set(recommendations.map(r => r.course.id));
    const relevantIds = new Set(testInteractions.map(i => i.courseId));

    const truePositives = Array.from(recommendedIds).filter(id => relevantIds.has(id)).length;

    const precision = recommendedIds.size > 0 ? truePositives / recommendedIds.size : 0;
    const recall = relevantIds.size > 0 ? truePositives / relevantIds.size : 0;

    const accuracy = (precision + recall) / 2;

    const coverage = new Set(recommendations.map(r => r.course.category)).size /
                    new Set(this.courses.map(c => c.category)).size;

    const avgScore = recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length;
    const diversity = 1 - (avgScore > 0.8 ? 0.3 : 0);

    return {
      accuracy: Math.round(accuracy * 100) / 100,
      precision: Math.round(precision * 100) / 100,
      recall: Math.round(recall * 100) / 100,
      coverage: Math.round(coverage * 100) / 100,
      diversity: Math.round(diversity * 100) / 100
    };
  }
}
