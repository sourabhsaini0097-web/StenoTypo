import React, { useState } from 'react';
import { User, TestPassage, TestResult, LanguageType, TestType, BackspaceRule } from '../types/steno';
import { StorageService } from '../services/storage';
import {
  Users,
  Headphones,
  Keyboard,
  Award,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Trash2,
  RefreshCw,
  Upload,
  Play,
  Eye,
  ShieldCheck,
  FileAudio,
  Sparkles,
  ArrowRight,
  Filter,
  FileText,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectResultToView: (result: TestResult) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectResultToView }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'passages' | 'results' | 'create_passage'>('students');

  // Data states
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [passages, setPassages] = useState<TestPassage[]>(StorageService.getPassages());
  const [results, setResults] = useState<TestResult[]>(StorageService.getResults());

  // Student filter & search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<User | null>(null);

  // Passage type filter for separating Dictation and Typing
  const [passageTypeFilter, setPassageTypeFilter] = useState<'all' | 'dictation' | 'typing'>('all');

  // New passage form state
  const [passageForm, setPassageForm] = useState<{
    title: string;
    type: TestType;
    language: LanguageType;
    targetWpm: number;
    durationMinutes: number;
    masterText: string;
    category: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    backspaceRule: BackspaceRule;
    audioFileName?: string;
    audioUrl?: string;
  }>({
    title: '',
    type: 'typing',
    language: 'hindi',
    targetWpm: 35,
    durationMinutes: 10,
    masterText: '',
    category: 'General Typing',
    difficulty: 'Moderate',
    backspaceRule: 'allowed',
  });

  const [audioUploadFeedback, setAudioUploadFeedback] = useState<string | null>(null);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  // Stats calculation
  const students = users.filter((u) => u.role === 'student');
  const activeSubscribers = students.filter((s) => s.subscriptionStatus === 'active');
  const expiredSubscribers = students.filter((s) => s.subscriptionStatus === 'expired');

  // Refresh data from storage
  const reloadData = () => {
    setUsers(StorageService.getUsers());
    setPassages(StorageService.getPassages());
    setResults(StorageService.getResults());
  };

  // Student subscription extension
  const handleExtendSubscription = (studentId: string, daysToAdd: number) => {
    const student = users.find((u) => u.id === studentId);
    if (!student) return;

    const baseDate =
      student.subscriptionStatus === 'expired'
        ? new Date()
        : new Date(student.subscriptionExpiry);

    baseDate.setDate(baseDate.getDate() + daysToAdd);

    StorageService.updateStudentSubscription(studentId, {
      expiryDate: baseDate.toISOString(),
      status: 'active',
    });

    reloadData();
  };

  const handleForceExpire = (studentId: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    StorageService.updateStudentSubscription(studentId, {
      expiryDate: yesterday.toISOString(),
      status: 'expired',
    });

    reloadData();
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Are you sure you want to remove this student? (Test history will be preserved).')) {
      StorageService.deleteStudent(studentId);
      reloadData();
    }
  };

  // Handle text file upload for paragraphs
  const handleTextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const trimmed = content.trim();
        const hasHindi = /[\u0900-\u097F]/.test(trimmed);
        const wordCount = trimmed.split(/\s+/).length;

        setPassageForm((prev) => ({
          ...prev,
          masterText: trimmed,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
          language: hasHindi ? 'hindi' : 'english',
          durationMinutes: Math.max(1, Math.round(wordCount / 35)),
        }));
      }
    };
    reader.readAsText(file);
  };

  // Handle audio file upload (FileReader converts to base64 data URL)
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please upload a valid audio file (MP3, WAV, AAC, etc.)');
      return;
    }

    setAudioUploadFeedback(`Loading ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setPassageForm((prev) => ({
        ...prev,
        audioUrl: base64Data,
        audioFileName: file.name,
      }));
      setAudioUploadFeedback(`✓ ${file.name} uploaded successfully (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    };
    reader.readAsDataURL(file);
  };

  // Save new test passage
  const handleCreatePassage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passageForm.title.trim() || !passageForm.masterText.trim()) {
      alert('Please fill in title and master text paragraph.');
      return;
    }

    const newPassage: TestPassage = {
      id: `passage_${Date.now()}`,
      title: passageForm.title.trim(),
      type: passageForm.type,
      language: passageForm.language,
      targetWpm: Number(passageForm.targetWpm),
      durationMinutes: Number(passageForm.durationMinutes),
      masterText: passageForm.masterText.trim(),
      category: passageForm.category,
      difficulty: passageForm.difficulty,
      backspaceRule: passageForm.backspaceRule,
      audioUrl: passageForm.audioUrl,
      audioFileName: passageForm.audioFileName,
      createdAt: new Date().toISOString(),
    };

    StorageService.addPassage(newPassage);
    reloadData();
    setUploadSuccessNotice(`Paragraph "${newPassage.title}" published! Students can now type this paragraph in their portal.`);
    setActiveTab('passages');
    setAudioUploadFeedback(null);
    setPassageForm({
      title: '',
      type: 'typing',
      language: 'hindi',
      targetWpm: 35,
      durationMinutes: 10,
      masterText: '',
      category: 'General Typing',
      difficulty: 'Moderate',
      backspaceRule: 'allowed',
    });

    setTimeout(() => {
      setUploadSuccessNotice(null);
    }, 6000);
  };

  const handleDeletePassage = (id: string) => {
    if (confirm('Delete this test passage?')) {
      StorageService.deletePassage(id);
      reloadData();
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()));

    const matchesStatus =
      studentStatusFilter === 'all' || s.subscriptionStatus === studentStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Upload Success Alert */}
      {uploadSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="text-sm font-semibold">{uploadSuccessNotice}</span>
          </div>
          <button
            onClick={() => setUploadSuccessNotice(null)}
            className="text-xs font-mono text-emerald-800 hover:text-emerald-950 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Total Enrolled</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {students.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Registered Candidates</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-700 font-semibold">Active Subscriptions</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-700 mt-2 tabular-nums">
            {activeSubscribers.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Authorized for Exam Access</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-red-600 font-semibold">Expired Accounts</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-bold font-mono text-red-600 mt-2 tabular-nums">
            {expiredSubscribers.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Login Blocked (History Safe)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-amber-700 font-semibold">Tests Attempted</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {results.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Evaluated Submissions</span>
        </div>
      </div>

      {/* Navigation tabs & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('students');
              setSelectedStudentForHistory(null);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'students'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Management ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('passages')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'passages'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Uploaded Paragraphs & Tests ({passages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'results'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Candidate Evaluation Ledger ({results.length})</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('create_passage')}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Paragraph / Add Test</span>
        </button>
      </div>

      {/* TAB 1: STUDENT MANAGEMENT */}
      {activeTab === 'students' && !selectedStudentForHistory && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-emerald-200 rounded-2xl shadow-xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search candidate by name, roll no, email..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
              <span className="text-slate-500 font-mono mr-1">Status:</span>
              <button
                onClick={() => setStudentStatusFilter('all')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  studentStatusFilter === 'all'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-emerald-200'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setStudentStatusFilter('active')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  studentStatusFilter === 'active'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-emerald-200'
                }`}
              >
                Active ({activeSubscribers.length})
              </button>
              <button
                onClick={() => setStudentStatusFilter('expired')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  studentStatusFilter === 'expired'
                    ? 'bg-red-600 text-white font-medium'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-emerald-200'
                }`}
              >
                Expired ({expiredSubscribers.length})
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-emerald-50 text-emerald-950 font-mono uppercase tracking-wider text-[11px] border-b border-emerald-200 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Candidate Details</th>
                    <th className="py-3.5 px-4">Subscription Plan</th>
                    <th className="py-3.5 px-4">Status & Validity</th>
                    <th className="py-3.5 px-4">Test History</th>
                    <th className="py-3.5 px-4 text-right">Subscription Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                        No students match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const isExpired = s.subscriptionStatus === 'expired';
                      const expiryTime = new Date(s.subscriptionExpiry).getTime();
                      const now = new Date().getTime();
                      const daysRemaining = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
                      const attemptsCount = results.filter((r) => r.studentId === s.id).length;

                      return (
                        <tr key={s.id} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">{s.email}</div>
                            {s.rollNo && (
                              <div className="text-[10px] font-mono text-slate-400">
                                Roll: {s.rollNo} · {s.phone || 'No Phone'}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                              {s.subscriptionPlan} Plan
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  isExpired ? 'bg-red-500' : 'bg-emerald-500'
                                }`}
                              />
                              <span
                                className={`font-semibold ${
                                  isExpired ? 'text-red-600' : 'text-emerald-700'
                                }`}
                              >
                                {isExpired ? 'Expired' : 'Active'}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {isExpired ? (
                                <span className="text-red-600 font-medium">
                                  Expired on{' '}
                                  {new Date(s.subscriptionExpiry).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              ) : (
                                <span>
                                  Valid until{' '}
                                  {new Date(s.subscriptionExpiry).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}{' '}
                                  ({daysRemaining}d left)
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedStudentForHistory(s)}
                              className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1.5"
                            >
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{attemptsCount} Attempts</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Extend buttons */}
                              <button
                                onClick={() => handleExtendSubscription(s.id, 30)}
                                title="Add 30 Days of Active Validity"
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded transition-colors"
                              >
                                +30d Renew
                              </button>

                              <button
                                onClick={() => handleExtendSubscription(s.id, 90)}
                                title="Add 90 Days of Active Validity"
                                className="hidden sm:inline-block px-2 py-1 text-[11px] font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 border border-teal-300 rounded transition-colors"
                              >
                                +90d
                              </button>

                              {!isExpired ? (
                                <button
                                  onClick={() => handleForceExpire(s.id)}
                                  title="Expire Account Now (Immediate Access Revocation)"
                                  className="px-2 py-1 text-[11px] text-amber-700 hover:bg-amber-100 border border-amber-300 rounded"
                                >
                                  Expire Now
                                </button>
                              ) : null}

                              <button
                                onClick={() => handleDeleteStudent(s.id)}
                                title="Delete Candidate"
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-emerald-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT TEST HISTORY SUB-VIEW */}
      {selectedStudentForHistory && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Student Examination Records: {selectedStudentForHistory.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    selectedStudentForHistory.subscriptionStatus === 'expired'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {selectedStudentForHistory.subscriptionStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Email: {selectedStudentForHistory.email} · Permanent DB History Preservation
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedStudentForHistory.subscriptionStatus === 'expired' && (
                <button
                  onClick={() => {
                    handleExtendSubscription(selectedStudentForHistory.id, 30);
                    setSelectedStudentForHistory(
                      StorageService.getUsers().find((u) => u.id === selectedStudentForHistory.id) || null
                    );
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md hover:bg-emerald-200"
                >
                  +30 Days Renew Account
                </button>
              )}
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md"
              >
                Back to All Students
              </button>
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-emerald-50 text-emerald-950 font-mono uppercase text-[11px] border-b border-emerald-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4">Exam Format</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Net Speed (WPM)</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Mistakes</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {results.filter((r) => r.studentId === selectedStudentForHistory.id).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                        This candidate has not attempted any tests yet.
                      </td>
                    </tr>
                  ) : (
                    results
                      .filter((r) => r.studentId === selectedStudentForHistory.id)
                      .map((res) => (
                        <tr key={res.id} className="hover:bg-emerald-50/50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{res.testTitle}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                              res.type === 'dictation'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-teal-100 text-teal-800 border border-teal-300'
                            }`}>
                              {res.type === 'dictation' ? <Headphones className="w-3 h-3 text-emerald-700" /> : <Keyboard className="w-3 h-3 text-teal-700" />}
                              <span>{res.type === 'dictation' ? 'Dictation' : 'Typing'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              res.language === 'hindi'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-sky-50 text-sky-800 border border-sky-200'
                            }`}>
                              {res.language === 'hindi' ? 'Hindi (हिंदी)' : 'English'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700 tabular-nums">
                            {res.netWpm} WPM
                          </td>
                          <td className="py-3 px-4 font-mono text-teal-700 tabular-nums">
                            {res.accuracy}%
                          </td>
                          <td className="py-3 px-4 font-mono text-amber-600 tabular-nums">
                            {res.totalMistakes} ({res.mistakePercentage}%)
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                res.passed
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {res.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onSelectResultToView(res)}
                              className="px-2.5 py-1 text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
                            >
                              Inspect Diff
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOADED PARAGRAPHS & TESTS MANAGEMENT */}
      {activeTab === 'passages' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Uploaded Dictations & Typing Paragraphs ({passages.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage audio dictations and typing paragraphs separately.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Separate Dictation and Typing Filters */}
              <div className="flex items-center p-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPassageTypeFilter('all')}
                  className={`px-3 py-1 rounded transition-colors ${
                    passageTypeFilter === 'all'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({passages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPassageTypeFilter('dictation')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    passageTypeFilter === 'dictation'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Headphones className="w-3 h-3" />
                  <span>Dictations ({passages.filter((p) => p.type === 'dictation').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPassageTypeFilter('typing')}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    passageTypeFilter === 'typing'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Keyboard className="w-3 h-3" />
                  <span>Typing ({passages.filter((p) => p.type === 'typing').length})</span>
                </button>
              </div>

              <button
                onClick={() => setActiveTab('create_passage')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passages
              .filter((p) => passageTypeFilter === 'all' || p.type === passageTypeFilter)
              .map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                      {p.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        p.language === 'hindi'
                          ? 'bg-amber-50 border border-amber-200 text-amber-800'
                          : 'bg-teal-50 border border-teal-200 text-teal-800'
                      }`}
                    >
                      {p.language} · {p.type === 'dictation' ? 'Audio Dictation' : 'Typing Test'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title}</h3>

                  <div className="mt-2 flex items-center gap-3 text-xs font-mono text-slate-500">
                    <span>Target: {p.targetWpm} WPM</span>
                    <span>·</span>
                    <span>Duration: {p.durationMinutes} min</span>
                    <span>·</span>
                    <span className="capitalize">Backspace: {p.backspaceRule}</span>
                  </div>

                  {p.audioUrl ? (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-mono">
                      <FileAudio className="w-4 h-4" />
                      <span>Custom Audio Attached ({p.audioFileName || 'Audio Track'})</span>
                    </div>
                  ) : p.type === 'dictation' ? (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>Built-in Speech Synthesizer</span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Paragraph Text to Type (~{p.masterText.split(/\s+/).length} words)</span>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100 font-sans">
                    {p.masterText}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Uploaded {new Date(p.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleDeletePassage(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-emerald-50 transition-colors"
                    title="Delete Paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATE EVALUATION LEDGER */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="bg-white border border-emerald-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-emerald-50 text-emerald-950 font-mono uppercase text-[11px] border-b border-emerald-200 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Examination</th>
                    <th className="py-3.5 px-4">Exam Format</th>
                    <th className="py-3.5 px-4">Language</th>
                    <th className="py-3.5 px-4">Net Speed</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4">Mistake %</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Detailed Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                        No examination attempts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    results.map((res) => (
                      <tr key={res.id} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{res.studentName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{res.studentEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{res.testTitle}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            res.type === 'dictation'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-teal-100 text-teal-800 border border-teal-300'
                          }`}>
                            {res.type === 'dictation' ? <Headphones className="w-3 h-3 text-emerald-700" /> : <Keyboard className="w-3 h-3 text-teal-700" />}
                            <span>{res.type === 'dictation' ? 'Dictation' : 'Typing'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            res.language === 'hindi'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-sky-50 text-sky-800 border border-sky-200'
                          }`}>
                            {res.language === 'hindi' ? 'Hindi (हिंदी)' : 'English'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700 tabular-nums">
                          {res.netWpm} WPM
                        </td>
                        <td className="py-3 px-4 font-mono text-teal-700 tabular-nums">
                          {res.accuracy}%
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-600 tabular-nums">
                          <span className="font-bold">{res.mistakePercentage}%</span>
                          <span className="block text-[10px] text-slate-500 font-normal">
                            F: {res.fullMistakes ?? 0} · H: {res.halfMistakes ?? 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              res.passed
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {res.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectResultToView(res)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          >
                            View Word Diff
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UPLOAD PARAGRAPH / CREATE TEST */}
      {activeTab === 'create_passage' && (
        <div className="max-w-3xl mx-auto bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="pb-4 mb-6 border-b border-emerald-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Upload Paragraph for Students to Type
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload or paste Hindi/English text. Students will see and type this paragraph in their exam portal.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('passages')}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreatePassage} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                Paragraph Title / Exam Name *
              </label>
              <input
                type="text"
                required
                value={passageForm.title}
                onChange={(e) => setPassageForm({ ...passageForm, title: e.target.value })}
                placeholder="e.g. Hindi Court Judgment Typing Test 35 WPM"
                className="w-full px-3.5 py-2.5 rounded-lg bg-emerald-50/30 border border-emerald-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Test Format
                </label>
                <select
                  value={passageForm.type}
                  onChange={(e) =>
                    setPassageForm({ ...passageForm, type: e.target.value as TestType })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="typing">Text Typing Test (Students Type Paragraph)</option>
                  <option value="dictation">Audio Dictation (Steno Listening & Typing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Language
                </label>
                <select
                  value={passageForm.language}
                  onChange={(e) =>
                    setPassageForm({ ...passageForm, language: e.target.value as LanguageType })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="hindi">Hindi (हिंदी)</option>
                  <option value="english">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Target Speed (WPM)
                </label>
                <input
                  type="number"
                  min="15"
                  max="160"
                  value={passageForm.targetWpm}
                  onChange={(e) =>
                    setPassageForm({ ...passageForm, targetWpm: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={passageForm.durationMinutes}
                  onChange={(e) =>
                    setPassageForm({ ...passageForm, durationMinutes: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Exam Category
                </label>
                <select
                  value={passageForm.category}
                  onChange={(e) => setPassageForm({ ...passageForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="CPCT & Court Typing">CPCT & Court Typing</option>
                  <option value="SSC Steno Grade C/D">SSC Steno Grade C/D</option>
                  <option value="High Court Steno">High Court Steno</option>
                  <option value="General Typing">General Typing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mb-1.5">
                  Backspace Rule
                </label>
                <select
                  value={passageForm.backspaceRule}
                  onChange={(e) =>
                    setPassageForm({ ...passageForm, backspaceRule: e.target.value as BackspaceRule })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-emerald-50/30 border border-emerald-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="allowed">Allowed (Full Backspace)</option>
                  <option value="restricted">Restricted (Current Word Only)</option>
                  <option value="disabled">Disabled (Strict Exam Simulation)</option>
                </select>
              </div>
            </div>

            {/* Optional Audio Upload for Dictation Tests */}
            {passageForm.type === 'dictation' && (
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-mono uppercase font-semibold text-slate-800">
                      Dictation Audio File (Optional)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">MP3, WAV, AAC</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload audio recording. If none is uploaded, the platform will automatically synthesize natural Hindi or English dictation audio from your text.
                </p>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />
                  </label>

                  {audioUploadFeedback && (
                    <span className="text-xs font-mono text-emerald-700 font-medium">
                      {audioUploadFeedback}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Paragraph Text & File Upload */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold">
                  Paragraph Content (Students will type this) *
                </label>

                <div className="flex items-center gap-2">
                  {/* Upload text file button */}
                  <label className="cursor-pointer px-3 py-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload .txt File</span>
                    <input
                      type="file"
                      accept=".txt,text/plain"
                      onChange={handleTextFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Sample Hindi */}
                  <button
                    type="button"
                    onClick={() => {
                      const sampleHindi = 'महोदय, हमारे देश के संविधान निर्माताओं ने एक ऐसे लोकतांत्रिक समाज की परिकल्पना की थी जहाँ प्रत्येक नागरिक को समान अधिकार और न्याय प्राप्त हो सके। संसदीय बहसों और विधायी प्रक्रियाओं के माध्यम से ही जनहित के कानूनों का निर्माण होता है। न्यायपालिका की स्वतंत्रता और निष्पक्षता हमारे लोकतंत्र का आधार स्तम्भ है। डिजिटल अभिलेखीकरण और त्वरित टंकण कौशल प्रशासनिक दक्षता को नई दिशा प्रदान करते हैं।';
                      setPassageForm((prev) => ({
                        ...prev,
                        title: prev.title || 'संसदीय व्यवस्था व संविधान (Hindi Test)',
                        language: 'hindi',
                        masterText: sampleHindi,
                        durationMinutes: 5,
                      }));
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono text-emerald-800 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 rounded"
                  >
                    + Sample Hindi
                  </button>

                  {/* Sample English */}
                  <button
                    type="button"
                    onClick={() => {
                      const sampleEng = 'The administration of public justice requires steadfast adherence to constitutional principles, procedural fairness, and institutional integrity. Speed and accuracy in digital documentation play a pivotal role in accelerating courtroom efficiency and delivering timely outcomes to citizens across all jurisdictions.';
                      setPassageForm((prev) => ({
                        ...prev,
                        title: prev.title || 'Judicial Administration & Governance (English Test)',
                        language: 'english',
                        masterText: sampleEng,
                        durationMinutes: 5,
                      }));
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono text-teal-800 hover:bg-teal-100 bg-teal-50 border border-teal-200 rounded"
                  >
                    + Sample English
                  </button>
                </div>
              </div>

              <textarea
                required
                rows={7}
                value={passageForm.masterText}
                onChange={(e) => {
                  const val = e.target.value;
                  const hasHindi = /[\u0900-\u097F]/.test(val);
                  setPassageForm({
                    ...passageForm,
                    masterText: val,
                    ...(val.trim() && { language: hasHindi ? 'hindi' : 'english' }),
                  });
                }}
                placeholder={
                  passageForm.language === 'hindi'
                    ? 'यहाँ पैराग्राफ पेस्ट करें या ऊपर "Upload .txt File" बटन दबाकर अपने कंप्यूटर से फाइल अपलोड करें...'
                    : 'Paste the paragraph text here or click "Upload .txt File" above to load text directly...'
                }
                className="w-full p-4 rounded-xl bg-emerald-50/30 border border-emerald-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                <span>
                  Total Words:{' '}
                  <strong className="text-emerald-800 font-bold">
                    {passageForm.masterText.trim()
                      ? passageForm.masterText.trim().split(/\s+/).length
                      : 0}
                  </strong>{' '}
                  words
                </span>
                <span>
                  Detected Language:{' '}
                  <strong className="text-emerald-800 uppercase font-semibold">
                    {passageForm.language}
                  </strong>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('passages')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-emerald-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save & Publish Paragraph</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
