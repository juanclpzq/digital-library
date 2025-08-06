// ============================================================================
// USE BOOK STATS HOOK - COMPREHENSIVE BOOK STATISTICS CALCULATIONS
// FILE LOCATION: src/hooks/useBookStats.ts
// ============================================================================

import { useMemo } from "react";
import type { Book, BookCategory, ReadingStatus } from "@/types";

// ============================================================================
// STATISTICS INTERFACES
// ============================================================================

export interface BookStats {
  // Basic counts
  total: number;
  completed: number;
  reading: number;
  wantToRead: number;
  paused: number;
  abandoned: number;

  // Percentages
  completionRate: number;
  readingRate: number;
  abandonmentRate: number;

  // Ratings
  avgRating: number;
  totalRatedBooks: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;

  // Progress
  avgProgress: number;
  totalPages: number;
  pagesRead: number;
  pagesRemaining: number;

  // Time-based
  booksThisWeek: number;
  booksThisMonth: number;
  booksThisYear: number;
  booksLastYear: number;

  // Categories
  categoryStats: CategoryStats[];
  favoriteCategory: string;

  // Authors
  authorStats: AuthorStats[];
  favoriteAuthor: string;
  uniqueAuthors: number;

  // Trends
  monthlyTrends: MonthlyTrend[];
  yearlyTrends: YearlyTrend[];

  // Goals & Achievements
  readingStreak: number;
  longestStreak: number;
  booksPerMonth: number;
  estimatedYearlyTotal: number;

  // Advanced metrics
  diversityScore: number;
  averageBookLength: number;
  readingVelocity: number; // pages per day
}

export interface CategoryStats {
  category: BookCategory;
  count: number;
  completed: number;
  reading: number;
  avgRating: number;
  percentage: number;
}

export interface AuthorStats {
  author: string;
  count: number;
  completed: number;
  avgRating: number;
  totalPages: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  booksCompleted: number;
  booksAdded: number;
  avgRating: number;
  pagesRead: number;
}

export interface YearlyTrend {
  year: number;
  booksCompleted: number;
  booksAdded: number;
  avgRating: number;
  pagesRead: number;
  favoriteCategory: string;
}

export interface UseBookStatsOptions {
  includeAdvanced?: boolean;
  includeTrends?: boolean;
  yearlyGoal?: number;
  customDateRange?: {
    start: Date;
    end: Date;
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getDateRange = (period: "week" | "month" | "year", offset = 0) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (period) {
    case "week":
      start.setDate(now.getDate() - now.getDay() - offset * 7);
      end.setDate(start.getDate() + 6);
      break;
    case "month":
      start.setMonth(now.getMonth() - offset, 1);
      end.setMonth(start.getMonth() + 1, 0);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - offset, 0, 1);
      end.setFullYear(start.getFullYear(), 11, 31);
      break;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const isDateInRange = (
  date: string | Date | undefined,
  start: Date,
  end: Date
): boolean => {
  if (!date) return false;
  const checkDate = new Date(date);
  return checkDate >= start && checkDate <= end;
};

const calculateDiversityScore = (books: Book[]): number => {
  if (books.length === 0) return 0;

  const categories = new Set(books.map((b) => b.category));
  const authors = new Set(books.map((b) => b.author));

  // Diversity score based on category and author variety
  const categoryDiversity = Math.min(categories.size / 10, 1); // Max 10 categories
  const authorDiversity = Math.min(authors.size / books.length, 1);

  return Math.round(((categoryDiversity + authorDiversity) / 2) * 100);
};

const calculateReadingStreak = (
  books: Book[]
): { current: number; longest: number } => {
  const completedBooks = books
    .filter((b) => b.readingStatus === "completed" && b.dateCompleted)
    .sort(
      (a, b) =>
        new Date(b.dateCompleted!).getTime() -
        new Date(a.dateCompleted!).getTime()
    );

  if (completedBooks.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const book of completedBooks) {
    const bookDate = new Date(book.dateCompleted!);

    if (lastDate) {
      const daysDiff = Math.floor(
        (lastDate.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 7) {
        // Within a week
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
      // Check if most recent book is within last week for current streak
      const daysSinceNow = Math.floor(
        (Date.now() - bookDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceNow <= 7) {
        currentStreak = 1;
      }
    }

    lastDate = bookDate;
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return { current: currentStreak, longest: longestStreak };
};

// ============================================================================
// MAIN USE BOOK STATS HOOK
// ============================================================================

export const useBookStats = (
  books: Book[],
  options: UseBookStatsOptions = {}
): BookStats => {
  const {
    includeAdvanced = true,
    includeTrends = true,
    yearlyGoal = 50,
    customDateRange,
  } = options;

  return useMemo(() => {
    if (books.length === 0) {
      return {
        total: 0,
        completed: 0,
        reading: 0,
        wantToRead: 0,
        paused: 0,
        abandoned: 0,
        completionRate: 0,
        readingRate: 0,
        abandonmentRate: 0,
        avgRating: 0,
        totalRatedBooks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        avgProgress: 0,
        totalPages: 0,
        pagesRead: 0,
        pagesRemaining: 0,
        booksThisWeek: 0,
        booksThisMonth: 0,
        booksThisYear: 0,
        booksLastYear: 0,
        categoryStats: [],
        favoriteCategory: "",
        authorStats: [],
        favoriteAuthor: "",
        uniqueAuthors: 0,
        monthlyTrends: [],
        yearlyTrends: [],
        readingStreak: 0,
        longestStreak: 0,
        booksPerMonth: 0,
        estimatedYearlyTotal: 0,
        diversityScore: 0,
        averageBookLength: 0,
        readingVelocity: 0,
      } as BookStats;
    }

    // Basic counts
    const total = books.length;
    const completed = books.filter(
      (b) => b.readingStatus === "completed"
    ).length;
    const reading = books.filter((b) => b.readingStatus === "reading").length;
    const wantToRead = books.filter(
      (b) => b.readingStatus === "want-to-read"
    ).length;
    const paused = books.filter((b) => b.readingStatus === "paused").length;
    const abandoned = books.filter(
      (b) => b.readingStatus === "abandoned"
    ).length;

    // Percentages
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    const readingRate = total > 0 ? Math.round((reading / total) * 100) : 0;
    const abandonmentRate =
      total > 0 ? Math.round((abandoned / total) * 100) : 0;

    // Ratings
    const ratedBooks = books.filter((b) => b.rating);
    const totalRatedBooks = ratedBooks.length;
    const avgRating =
      totalRatedBooks > 0
        ? Math.round(
            (ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) /
              totalRatedBooks) *
              10
          ) / 10
        : 0;

    const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratedBooks.forEach((book) => {
      if (book.rating && book.rating >= 1 && book.rating <= 5) {
        ratingDistribution[Math.round(book.rating) as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    // Progress & Pages
    const totalPages = books.reduce((sum, b) => sum + (b.totalPages || 0), 0);
    const pagesRead = books.reduce((sum, b) => {
      const pages = b.totalPages || 0;
      const progress = b.progress || 0;
      return sum + Math.round((pages * progress) / 100);
    }, 0);
    const pagesRemaining = totalPages - pagesRead;
    const avgProgress =
      books.length > 0
        ? Math.round(
            books.reduce((sum, b) => sum + (b.progress || 0), 0) / books.length
          )
        : 0;

    // Time-based counts
    const thisWeek = getDateRange("week");
    const thisMonth = getDateRange("month");
    const thisYear = getDateRange("year");
    const lastYear = getDateRange("year", 1);

    const booksThisWeek = books.filter((b) =>
      isDateInRange(
        b.dateCompleted || b.dateAdded,
        thisWeek.start,
        thisWeek.end
      )
    ).length;

    const booksThisMonth = books.filter((b) =>
      isDateInRange(
        b.dateCompleted || b.dateAdded,
        thisMonth.start,
        thisMonth.end
      )
    ).length;

    const booksThisYear = books.filter((b) =>
      isDateInRange(
        b.dateCompleted || b.dateAdded,
        thisYear.start,
        thisYear.end
      )
    ).length;

    const booksLastYear = books.filter((b) =>
      isDateInRange(
        b.dateCompleted || b.dateAdded,
        lastYear.start,
        lastYear.end
      )
    ).length;

    // Category statistics
    const categoryMap = new Map<string, { books: Book[]; completed: number }>();

    books.forEach((book) => {
      const category = book.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { books: [], completed: 0 });
      }
      categoryMap.get(category)!.books.push(book);
      if (book.readingStatus === "completed") {
        categoryMap.get(category)!.completed++;
      }
    });

    const categoryStats: CategoryStats[] = Array.from(categoryMap.entries())
      .map(([category, data]) => {
        const ratedInCategory = data.books.filter((b) => b.rating);
        return {
          category: category as BookCategory,
          count: data.books.length,
          completed: data.completed,
          reading: data.books.filter((b) => b.readingStatus === "reading")
            .length,
          avgRating:
            ratedInCategory.length > 0
              ? Math.round(
                  (ratedInCategory.reduce(
                    (sum, b) => sum + (b.rating || 0),
                    0
                  ) /
                    ratedInCategory.length) *
                    10
                ) / 10
              : 0,
          percentage: Math.round((data.books.length / total) * 100),
        };
      })
      .sort((a, b) => b.count - a.count);

    const favoriteCategory =
      categoryStats.length > 0 ? categoryStats[0].category : "";

    // Author statistics
    const authorMap = new Map<string, Book[]>();
    books.forEach((book) => {
      if (!authorMap.has(book.author)) {
        authorMap.set(book.author, []);
      }
      authorMap.get(book.author)!.push(book);
    });

    const authorStats: AuthorStats[] = Array.from(authorMap.entries())
      .map(([author, authorBooks]) => {
        const ratedBooks = authorBooks.filter((b) => b.rating);
        return {
          author,
          count: authorBooks.length,
          completed: authorBooks.filter((b) => b.readingStatus === "completed")
            .length,
          avgRating:
            ratedBooks.length > 0
              ? Math.round(
                  (ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) /
                    ratedBooks.length) *
                    10
                ) / 10
              : 0,
          totalPages: authorBooks.reduce(
            (sum, b) => sum + (b.totalPages || 0),
            0
          ),
        };
      })
      .sort((a, b) => b.count - a.count);

    const favoriteAuthor = authorStats.length > 0 ? authorStats[0].author : "";
    const uniqueAuthors = authorStats.length;

    // Advanced metrics
    let diversityScore = 0;
    let averageBookLength = 0;
    let readingVelocity = 0;
    let monthlyTrends: MonthlyTrend[] = [];
    let yearlyTrends: YearlyTrend[] = [];

    if (includeAdvanced) {
      diversityScore = calculateDiversityScore(books);
      averageBookLength =
        totalPages > 0
          ? Math.round(totalPages / books.filter((b) => b.totalPages).length)
          : 0;

      // Reading velocity (pages per day) based on completed books
      const completedWithDates = books.filter(
        (b) =>
          b.readingStatus === "completed" && b.dateStarted && b.dateCompleted
      );

      if (completedWithDates.length > 0) {
        const totalDays = completedWithDates.reduce((sum, book) => {
          const start = new Date(book.dateStarted!);
          const end = new Date(book.dateCompleted!);
          const days = Math.max(
            1,
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
          );
          return sum + days;
        }, 0);

        const totalPagesCompleted = completedWithDates.reduce(
          (sum, b) => sum + (b.totalPages || 0),
          0
        );
        readingVelocity =
          Math.round((totalPagesCompleted / totalDays) * 10) / 10;
      }
    }

    // Trends
    if (includeTrends) {
      // Generate monthly trends for last 12 months
      monthlyTrends = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        const monthStart = new Date(year, date.getMonth(), 1);
        const monthEnd = new Date(year, date.getMonth() + 1, 0);

        const monthBooks = books.filter((b) =>
          isDateInRange(b.dateCompleted || b.dateAdded, monthStart, monthEnd)
        );

        const monthCompleted = monthBooks.filter(
          (b) => b.readingStatus === "completed"
        );
        const monthRated = monthBooks.filter((b) => b.rating);

        return {
          month,
          year,
          booksCompleted: monthCompleted.length,
          booksAdded: monthBooks.length,
          avgRating:
            monthRated.length > 0
              ? Math.round(
                  (monthRated.reduce((sum, b) => sum + (b.rating || 0), 0) /
                    monthRated.length) *
                    10
                ) / 10
              : 0,
          pagesRead: monthCompleted.reduce(
            (sum, b) => sum + (b.totalPages || 0),
            0
          ),
        };
      }).reverse();

      // Generate yearly trends
      const years = new Set(
        books.map((b) => {
          const date = new Date(b.dateAdded || Date.now());
          return date.getFullYear();
        })
      );

      yearlyTrends = Array.from(years)
        .sort((a, b) => b - a)
        .map((year) => {
          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31);

          const yearBooks = books.filter((b) =>
            isDateInRange(b.dateAdded, yearStart, yearEnd)
          );

          const yearCompleted = yearBooks.filter(
            (b) => b.readingStatus === "completed"
          );
          const yearRated = yearBooks.filter((b) => b.rating);

          // Find favorite category for the year
          const yearCategories = new Map<string, number>();
          yearBooks.forEach((book) => {
            yearCategories.set(
              book.category,
              (yearCategories.get(book.category) || 0) + 1
            );
          });

          const yearFavoriteCategory =
            yearCategories.size > 0
              ? Array.from(yearCategories.entries()).sort(
                  (a, b) => b[1] - a[1]
                )[0][0]
              : "";

          return {
            year,
            booksCompleted: yearCompleted.length,
            booksAdded: yearBooks.length,
            avgRating:
              yearRated.length > 0
                ? Math.round(
                    (yearRated.reduce((sum, b) => sum + (b.rating || 0), 0) /
                      yearRated.length) *
                      10
                  ) / 10
                : 0,
            pagesRead: yearCompleted.reduce(
              (sum, b) => sum + (b.totalPages || 0),
              0
            ),
            favoriteCategory: yearFavoriteCategory,
          };
        });
    }

    // Reading streak
    const streakData = calculateReadingStreak(books);
    const readingStreak = streakData.current;
    const longestStreak = streakData.longest;

    // Goals and projections
    const currentMonth = new Date().getMonth() + 1;
    const booksPerMonth =
      booksThisYear > 0
        ? Math.round((booksThisYear / currentMonth) * 10) / 10
        : 0;
    const estimatedYearlyTotal = Math.round(booksPerMonth * 12);

    return {
      // Basic counts
      total,
      completed,
      reading,
      wantToRead,
      paused,
      abandoned,

      // Percentages
      completionRate,
      readingRate,
      abandonmentRate,

      // Ratings
      avgRating,
      totalRatedBooks,
      ratingDistribution,

      // Progress
      avgProgress,
      totalPages,
      pagesRead,
      pagesRemaining,

      // Time-based
      booksThisWeek,
      booksThisMonth,
      booksThisYear,
      booksLastYear,

      // Categories
      categoryStats,
      favoriteCategory,

      // Authors
      authorStats,
      favoriteAuthor,
      uniqueAuthors,

      // Trends
      monthlyTrends,
      yearlyTrends,

      // Goals & Achievements
      readingStreak,
      longestStreak,
      booksPerMonth,
      estimatedYearlyTotal,

      // Advanced metrics
      diversityScore,
      averageBookLength,
      readingVelocity,
    };
  }, [books, includeAdvanced, includeTrends, yearlyGoal, customDateRange]);
};
