export type UserRole = 'admin' | 'student';

export type SubscriptionStatus = 'active' | 'expired' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  rollNo?: string;
  password?: string;
  subscriptionPlan: 'Monthly' | 'Quarterly' | 'Annual' | 'Lifetime';
  subscriptionStart: string; // ISO string
  subscriptionExpiry: string; // ISO string
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
}

export type LanguageType = 'hindi' | 'english';
export type TestType = 'dictation' | 'typing';
export type BackspaceRule = 'allowed' | 'restricted' | 'disabled';
export type HindiKeyboardLayout = 'remington_gail' | 'inscript' | 'system_ime';

export interface TestPassage {
  id: string;
  title: string;
  type: TestType;
  language: LanguageType;
  targetWpm: number;
  durationMinutes: number;
  masterText: string;
  audioUrl?: string; // Base64 data URL or external audio
  audioFileName?: string;
  category: string; // e.g. 'SSC Steno Grade C/D', 'High Court', 'General Typing'
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  backspaceRule: BackspaceRule;
  readingTimeMinutes?: number;
  createdAt: string;
}

export interface DiffWord {
  expected: string;
  typed: string;
  status: 'correct' | 'wrong' | 'missing' | 'extra';
  isHalfMistake?: boolean;
  mistakeType?: 'full' | 'half' | 'ignored';
  mistakeReason?: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  testId: string;
  testTitle: string;
  type: TestType;
  language: LanguageType;
  keyboardLayout?: HindiKeyboardLayout;
  submittedAt: string;
  timeTakenSeconds: number;
  totalWordsMaster: number;
  typedWordsCount: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  correctWords: number;
  fullMistakes: number;
  halfMistakes: number;
  totalMistakes: number;
  mistakePercentage: number;
  backspaceCount: number;
  passed: boolean;
  typedText: string;
  diffAnalysis: DiffWord[];
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}
