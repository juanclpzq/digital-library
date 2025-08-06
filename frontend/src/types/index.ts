// ============================================================================
// GLOBAL TYPES - GEN X SOFTCLUB DIGITAL LIBRARY
// ============================================================================

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  theme: "softclub" | "dark" | "light";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ============================================================================
// BOOK TYPES - CORE ENTITY
// ============================================================================

export type ReadingStatus =
  | "want-to-read"
  | "reading"
  | "completed"
  | "paused"
  | "abandoned"
  | "reference";

export type BookCategory =
  | "Fiction"
  | "Non-Fiction"
  | "Science Fiction"
  | "Fantasy"
  | "Mystery"
  | "Romance"
  | "History"
  | "Science"
  | "Philosophy"
  | "Biography"
  | "Technology"
  | "Art"
  | "Self-Help"
  | "Business"
  | "Other";

export type FileFormat = "PDF" | "EPUB" | "MOBI" | "TXT" | "Other";

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  year?: number;
  publishedDate?: string;
  publisher?: string;
  pages?: number;
  category: BookCategory;
  subCategories?: string[];
  tags?: string[];
  language?: string;

  // File Information
  fileUrl?: string;
  filePath?: string;
  fileType?: FileFormat;
  fileSize?: number;

  // Visual Assets
  coverImage?: string;
  images?: string[];

  // User Reading Data
  readingStatus: ReadingStatus;
  rating?: number;
  userReview?: string;
  userNotes?: string;
  progress: number;
  currentPage?: number;

  // Reading Dates
  startedReadingAt?: string;
  finishedReadingAt?: string;
  lastReadAt?: string;

  // Flags
  isFavorite: boolean;
  isPublic?: boolean;

  // Series Information
  series?: string;
  seriesNumber?: number;

  // External IDs
  googleBooksId?: string;
  goodreadsId?: string;

  // Metadata
  userId: string;
  importSource?: "manual" | "file-scan" | "api" | "bulk-import";
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// BOOK NOTES TYPES
// ============================================================================

export type NoteType = "highlight" | "note" | "quote" | "question";
export type NoteColor =
  | "soft-cyan"
  | "lavender-mist"
  | "peachy-keen"
  | "mint-dream"
  | "sunset-coral";

export interface BookNote {
  _id: string;
  bookId: string;
  userId: string;
  title: string;
  content: string;
  page?: number;
  chapter?: string;
  noteType: NoteType;
  color: NoteColor;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BooksResponse {
  success: boolean;
  data: Book[];
  pagination: PaginationInfo;
  stats: ReadingStats;
  filters: BookFilters;
}

// ============================================================================
// STATS & ANALYTICS TYPES
// ============================================================================

export interface ReadingStats {
  total: number;
  toRead: number;
  reading: number;
  completed: number;
  totalPageCount: number;
  avgRating: number;
  favoriteBooks: number;
}

export interface CategoryStats {
  _id: string;
  count: number;
  avgRating: number;
}

export interface DetailedStats {
  general: ReadingStats;
  byStatus: Array<{ _id: ReadingStatus; count: number; totalPages: number }>;
  byCategory: CategoryStats[];
  byYear: Array<{ _id: number; count: number }>;
  byFormat: Array<{ _id: FileFormat; count: number }>;
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface BookFilters {
  status?: ReadingStatus | "all";
  category?: BookCategory | "all";
  genre?: string;
  author?: string;
  series?: string;
  format?: FileFormat;
  language?: string;
  rating?: number;
  search?: string;
  tags?: string[];
  isFavorite?: boolean;
  year?: string; // Can be "2020" or "2020-2023"
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title" | "author" | "year" | "rating" | "pages";
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BookCardProps extends BaseComponentProps {
  book: Book;
  onStatusChange: (id: string, status: ReadingStatus) => void;
  onOpenBook: (url: string) => void;
  onToggleFavorite?: (id: string) => void;
  showNotes?: boolean;
}

export interface StatCardProps extends BaseComponentProps {
  label: string;
  value: number;
  gradient: string;
  icon?: string;
  trend?: "up" | "down" | "stable";
  isLoading?: boolean;
}

export interface FilterBarProps extends BaseComponentProps {
  filters: BookFilters;
  onFiltersChange: (filters: BookFilters) => void;
  categories: BookCategory[];
  totalResults?: number;
}

// ============================================================================
// THEME & DESIGN SYSTEM TYPES
// ============================================================================

export interface SoftclubTheme {
  colors: {
    softCyan: string;
    lavenderMist: string;
    peachyKeen: string;
    mintDream: string;
    sunsetCoral: string;
    cloudWhite: string;
    midnightNavy: string;
    silverMatte: string;
  };
  gradients: Record<string, string>;
  animations: Record<string, string>;
  shadows: Record<string, string>;
  spacing: Record<string, string>;
}

export type SoftclubColor = keyof SoftclubTheme["colors"];

export interface AnimationPreset {
  initial: object;
  animate: object;
  exit?: object;
  transition: object;
}

// ============================================================================
// FORM & VALIDATION TYPES
// ============================================================================

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: string;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

export type EventHandler<T = void> = (data: T) => void | Promise<void>;
export type AsyncEventHandler<T = void> = (data: T) => Promise<void>;

export interface BookEventHandlers {
  onStatusChange: EventHandler<{ id: string; status: ReadingStatus }>;
  onRatingChange: EventHandler<{ id: string; rating: number }>;
  onProgressUpdate: EventHandler<{
    id: string;
    progress: number;
    page?: number;
  }>;
  onNotesUpdate: EventHandler<{ id: string; notes: string }>;
  onBookOpen: EventHandler<{ id: string; url: string }>;
  onBookEdit: EventHandler<{ id: string }>;
  onBookDelete: EventHandler<{ id: string }>;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export * from "./../api/types";
export * from "./../components.types";
