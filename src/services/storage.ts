import { User, TestPassage, TestResult } from '../types/steno';

const USERS_KEY = 'stenotypo_users_v2';
const PASSAGES_KEY = 'stenotypo_passages_v2';
const RESULTS_KEY = 'stenotypo_results_v2';
const TOKEN_KEY = 'stenotypo_jwt_token';

// Default seed data
const SEED_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'Vikramaditya (Admin)',
    email: 'admin@stenotype.com',
    role: 'admin',
    phone: '+91 98765 43210',
    subscriptionPlan: 'Lifetime',
    subscriptionStart: '2026-01-01T00:00:00Z',
    subscriptionExpiry: '2099-12-31T23:59:59Z',
    subscriptionStatus: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    password: 'admin123',
  },
  {
    id: 'user_student_active_1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    role: 'student',
    rollNo: 'ST-2026-0142',
    phone: '+91 98111 22334',
    subscriptionPlan: 'Quarterly',
    subscriptionStart: '2026-08-01T00:00:00Z',
    subscriptionExpiry: '2026-12-31T23:59:59Z', // Active!
    subscriptionStatus: 'active',
    createdAt: '2026-08-01T10:00:00Z',
    password: 'student123',
  },
  {
    id: 'user_student_expired_1',
    name: 'Priya Verma',
    email: 'priya.verma@gmail.com',
    role: 'student',
    rollNo: 'ST-2026-0089',
    phone: '+91 98222 33445',
    subscriptionPlan: 'Monthly',
    subscriptionStart: '2026-08-01T00:00:00Z',
    subscriptionExpiry: '2026-09-30T23:59:59Z', // Expired in the past!
    subscriptionStatus: 'expired',
    createdAt: '2026-08-01T10:00:00Z',
    password: 'student123',
  },
  {
    id: 'user_student_active_2',
    name: 'Amit Kumar Singh',
    email: 'amit.singh@gmail.com',
    role: 'student',
    rollNo: 'ST-2026-0219',
    phone: '+91 98333 44556',
    subscriptionPlan: 'Annual',
    subscriptionStart: '2026-05-15T00:00:00Z',
    subscriptionExpiry: '2027-05-15T23:59:59Z', // Active!
    subscriptionStatus: 'active',
    createdAt: '2026-05-15T11:30:00Z',
    password: 'student123',
  },
];

const SEED_PASSAGES: TestPassage[] = [
  {
    id: 'passage-hindi-dict-1',
    title: 'SSC Steno Grade C/D 80 WPM Hindi Dictation',
    type: 'dictation',
    language: 'hindi',
    targetWpm: 80,
    durationMinutes: 5,
    category: 'SSC Steno Grade C/D',
    difficulty: 'Moderate',
    backspaceRule: 'allowed',
    readingTimeMinutes: 5,
    createdAt: '2026-09-10T10:00:00Z',
    masterText:
      'महोदय, भारत एक लोकतांत्रिक और संप्रभु गणराज्य है। हमारे देश की संसद जनता की आकांक्षाओं का सर्वोच्च प्रतीक है। जब भी किसी नए विधेयक पर चर्चा होती है, तो पक्ष और विपक्ष दोनों का यह पावन दायित्व बनता है कि वे राष्ट्रीय हित को सर्वोपरि रखें। माननीय सदस्यों ने जो सुझाव इस सदन में प्रस्तुत किए हैं, वे अत्यंत विचारणीय हैं। आर्थिक विकास और सामाजिक समरसता को गति देने के लिए आवश्यक है कि हमारी नीतियां पारदर्शी और जनोन्मुखी हों। शिक्षा और स्वास्थ्य के क्षेत्र में बजट आवंटन को बढ़ाना समय की मांग है। किसान भाइयों के परिश्रम से ही देश में अन्न सुरक्षा सुनिश्चित हो पाती है। अतः हमें ग्रामीण बुनियादी ढांचे को सुदृढ़ करने के लिए हर संभव प्रयास करना चाहिए।',
  },
  {
    id: 'passage-eng-dict-1',
    title: 'High Court 100 WPM English Legal Dictation',
    type: 'dictation',
    language: 'english',
    targetWpm: 100,
    durationMinutes: 5,
    category: 'High Court',
    difficulty: 'Hard',
    backspaceRule: 'restricted',
    readingTimeMinutes: 5,
    createdAt: '2026-09-12T14:30:00Z',
    masterText:
      'The learned counsel appearing for the petitioner vehemently submitted that the impugned order passed by the appellate authority suffers from an apparent error on the face of the record. It was contended that the statutory provisions governing the grant of temporary injunctions were not properly appreciated. The principles of natural justice were completely overlooked during the summary adjudication process. After hearing both parties and perusing the original case diary, this Court is of the considered opinion that prima facie balance of convenience tilts substantially in favor of the applicant. Therefore, the execution of the recovery warrant stands stayed until the final disposal of the present writ petition.',
  },
  {
    id: 'passage-hindi-type-1',
    title: 'Hindi Typing Speed Test (राजभाषा नीति व प्रशासन)',
    type: 'typing',
    language: 'hindi',
    targetWpm: 35,
    durationMinutes: 5,
    category: 'CPCT & Court Typing',
    difficulty: 'Moderate',
    backspaceRule: 'allowed',
    createdAt: '2026-09-15T09:15:00Z',
    masterText:
      'संविधान के अनुच्छेद 343 के अनुसार संघ की राजभाषा हिंदी और लिपि देवनागरी है। शासकीय कार्यों में सरल एवं सहज हिंदी का प्रयोग प्रोत्साहित किया जाना चाहिए। सभी केंद्रीय मंत्रालयों और उपक्रमों में हिंदी पखवाड़े का आयोजन कर कर्मचारियों को राजभाषा में कार्य करने हेतु प्रेरित किया जाता है। कंप्यूटर पर देवनागरी टाइपिंग के लिए रेमिंगटन गेल और इनस्क्रिप्ट कीबोर्ड लेआउट अत्यधिक लोकप्रिय हैं। निरंतर अभ्यास से गति और शुद्धता दोनों में अभूतपूर्व सुधार संभव है।',
  },
  {
    id: 'passage-eng-type-1',
    title: 'English Typing Speed Test (Digital Public Infrastructure)',
    type: 'typing',
    language: 'english',
    targetWpm: 40,
    durationMinutes: 5,
    category: 'General Typing',
    difficulty: 'Easy',
    backspaceRule: 'allowed',
    createdAt: '2026-09-18T16:00:00Z',
    masterText:
      'Digital public infrastructure has transformed public service delivery and financial inclusion across the nation. Unified payments and paperless authentication systems empower citizens to access welfare benefits directly with absolute transparency. High typing speed combined with high accuracy is an essential skill for modern administrative efficiency. Regular deliberate practice helps students eliminate typing fatigue, minimize typographical errors, and achieve professional certification standards.',
  },
];

const SEED_RESULTS: TestResult[] = [
  {
    id: 'result-demo-1',
    studentId: 'user_student_active_1',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@gmail.com',
    testId: 'passage-hindi-dict-1',
    testTitle: 'SSC Steno Grade C/D 80 WPM Hindi Dictation',
    type: 'dictation',
    language: 'hindi',
    keyboardLayout: 'remington_gail',
    submittedAt: '2026-09-25T11:45:00Z',
    timeTakenSeconds: 300,
    totalWordsMaster: 98,
    typedWordsCount: 96,
    grossWpm: 42,
    netWpm: 39,
    accuracy: 94.8,
    correctWords: 91,
    fullMistakes: 3,
    halfMistakes: 4,
    totalMistakes: 5,
    mistakePercentage: 5.1,
    backspaceCount: 14,
    passed: true,
    typedText:
      'महोदय, भारत एक लोकतांत्रिक और संप्रभु गणराज्य है। हमारे देश की संसद जनता की आकांक्षाओं का सर्वोच्च प्रतीक है। जब भी किसी नए विधेयक पर चर्चा होती है, तो पक्ष और विपक्ष दोनों का यह पावन दायित्व बनता है कि वे राष्ट्रीय हित को सर्वोपरि रखें।',
    diffAnalysis: [],
  },
  {
    id: 'result-demo-2',
    studentId: 'user_student_expired_1', // Expired student's history is safe!
    studentName: 'Priya Verma',
    studentEmail: 'priya.verma@gmail.com',
    testId: 'passage-eng-dict-1',
    testTitle: 'High Court 100 WPM English Legal Dictation',
    type: 'dictation',
    language: 'english',
    keyboardLayout: 'inscript',
    submittedAt: '2026-09-20T16:20:00Z',
    timeTakenSeconds: 300,
    totalWordsMaster: 86,
    typedWordsCount: 84,
    grossWpm: 46,
    netWpm: 43,
    accuracy: 93.0,
    correctWords: 79,
    fullMistakes: 4,
    halfMistakes: 4,
    totalMistakes: 6,
    mistakePercentage: 6.9,
    backspaceCount: 22,
    passed: true,
    typedText:
      'The learned counsel appearing for the petitioner submitted that the impugned order passed by the appellate authority suffers from an error on the face of the record.',
    diffAnalysis: [],
  },
];

// Helper to check and auto-expire students based on current date
function checkAndApplyAutoExpiration(users: User[]): { updatedUsers: User[]; changed: boolean } {
  const now = new Date().getTime();
  let changed = false;

  const updatedUsers = users.map((user) => {
    if (user.role === 'student') {
      const expiryTime = new Date(user.subscriptionExpiry).getTime();
      if (expiryTime < now && user.subscriptionStatus !== 'expired') {
        changed = true;
        return {
          ...user,
          subscriptionStatus: 'expired' as const,
        };
      }
    }
    return user;
  });

  return { updatedUsers, changed };
}

// Storage Operations
export const StorageService = {
  getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    let users: User[] = raw ? JSON.parse(raw) : SEED_USERS;

    // Automatic expiration check
    const { updatedUsers, changed } = checkAndApplyAutoExpiration(users);
    if (changed || !raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    }
    return users;
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getPassages(): TestPassage[] {
    const raw = localStorage.getItem(PASSAGES_KEY);
    if (!raw) {
      localStorage.setItem(PASSAGES_KEY, JSON.stringify(SEED_PASSAGES));
      return SEED_PASSAGES;
    }
    return JSON.parse(raw);
  },

  savePassages(passages: TestPassage[]): void {
    localStorage.setItem(PASSAGES_KEY, JSON.stringify(passages));
  },

  getResults(): TestResult[] {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) {
      localStorage.setItem(RESULTS_KEY, JSON.stringify(SEED_RESULTS));
      return SEED_RESULTS;
    }
    return JSON.parse(raw);
  },

  saveResults(results: TestResult[]): void {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  },

  addResult(result: TestResult): void {
    const results = this.getResults();
    results.unshift(result);
    this.saveResults(results);
  },

  addPassage(passage: TestPassage): void {
    const passages = this.getPassages();
    passages.unshift(passage);
    this.savePassages(passages);
  },

  deletePassage(id: string): void {
    const passages = this.getPassages().filter((p) => p.id !== id);
    this.savePassages(passages);
  },

  updateStudentSubscription(
    studentId: string,
    updates: {
      expiryDate: string;
      plan?: 'Monthly' | 'Quarterly' | 'Annual' | 'Lifetime';
      status?: 'active' | 'expired';
    }
  ): User | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === studentId);
    if (idx === -1) return null;

    const expiryTime = new Date(updates.expiryDate).getTime();
    const now = new Date().getTime();
    const status = updates.status || (expiryTime > now ? 'active' : 'expired');

    users[idx] = {
      ...users[idx],
      subscriptionExpiry: updates.expiryDate,
      subscriptionStatus: status,
      ...(updates.plan ? { subscriptionPlan: updates.plan } : {}),
    };

    this.saveUsers(users);
    return users[idx];
  },

  deleteStudent(studentId: string): void {
    const users = this.getUsers().filter((u) => u.id !== studentId);
    this.saveUsers(users);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
