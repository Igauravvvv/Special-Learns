import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  CalendarCheck,
  Bell,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Mail,
  Phone,
  FileText,
  Printer,
  Trash2,
  Edit2,
  ExternalLink,
  Shield,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Send,
  X,
} from 'lucide-react';
import Seo from '../components/Seo.jsx';

const COURSE_OPTIONS = [
  'Web Design & Development',
  'Graphic Design, Publishing & VFX',
  'Tally Prime, GST & Advanced Excel',
  'Computer Fundamentals & Office Automation',
  'Python Programming & Data Essentials',
  'C & C++ Programming',
  'Full Stack Web Development',
  'Digital Marketing & SEO',
  'Video Editing & Motion Graphics',
  'Tuition Classes (CBSE / School)',
];

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('sl_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview | admissions | fees | attendance | enquiries

  // Data states
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [feeAlerts, setFeeAlerts] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [enquiries, setEnquiries] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  // Modals
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState(null);
  const [receiptToPrint, setReceiptToPrint] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Admission Form State
  const [admissionForm, setAdmissionForm] = useState({
    name: '',
    rollNo: '',
    course: COURSE_OPTIONS[0],
    totalFees: 15000,
    monthlyFee: 2500,
    dueDay: 10,
    startDate: new Date().toISOString().slice(0, 10),
    durationMonths: 6,
    endDate: '',
    phone: '',
    email: '',
    guardianName: '',
    address: '',
  });

  // Fee Collection Form State
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    amount: '',
    paymentDate: new Date().toISOString().slice(0, 10),
    forMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    paymentMode: 'Cash',
    notes: '',
  });

  // Authenticate
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.message || 'Invalid login details.');
      } else {
        localStorage.setItem('sl_admin_token', data.token);
        setToken(data.token);
      }
    } catch (err) {
      setLoginError('Could not reach backend service.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sl_admin_token');
    setToken('');
    setOverview(null);
  };

  // Auth headers
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Load dashboard data
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [resOverview, resStudents, resFees, resAlerts, resAttendance, resEnquiries] = await Promise.all([
        fetch('/api/admin/overview', { headers: authHeaders }).then((r) => r.json()),
        fetch('/api/admin/students', { headers: authHeaders }).then((r) => r.json()),
        fetch('/api/admin/fees', { headers: authHeaders }).then((r) => r.json()),
        fetch('/api/admin/fees/alerts', { headers: authHeaders }).then((r) => r.json()),
        fetch(`/api/admin/attendance?date=${attendanceDate}`, { headers: authHeaders }).then((r) => r.json()),
        fetch('/api/admin/enquiries', { headers: authHeaders }).then((r) => r.json()),
      ]);

      if (resOverview.ok) setOverview(resOverview.data);
      if (resStudents.ok) setStudents(resStudents.data || []);
      if (resFees.ok) setFees(resFees.data || []);
      if (resAlerts.ok) setFeeAlerts(resAlerts.data);
      if (resEnquiries.ok) setEnquiries(resEnquiries.data || []);

      if (resAttendance.ok && Array.isArray(resAttendance.data)) {
        const attMap = {};
        resAttendance.data.forEach((item) => {
          attMap[item.studentId] = item.status;
        });
        setAttendanceRecords(attMap);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Reload attendance when date changes
  useEffect(() => {
    if (!token) return;
    fetch(`/api/admin/attendance?date=${attendanceDate}`, { headers: authHeaders })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && Array.isArray(res.data)) {
          const attMap = {};
          res.data.forEach((item) => {
            attMap[item.studentId] = item.status;
          });
          setAttendanceRecords(attMap);
        }
      })
      .catch(() => {});
  }, [attendanceDate]);

  // Duration auto-calc for End Date
  const handleDurationChange = (months) => {
    const num = Number(months) || 1;
    let endStr = '';
    if (admissionForm.startDate) {
      const d = new Date(admissionForm.startDate);
      d.setMonth(d.getMonth() + num);
      endStr = d.toISOString().slice(0, 10);
    }
    const monthly = Math.round(Number(admissionForm.totalFees || 0) / num);
    setAdmissionForm((prev) => ({
      ...prev,
      durationMonths: num,
      endDate: endStr,
      monthlyFee: monthly > 0 ? monthly : prev.monthlyFee,
    }));
  };

  // Submit Admission
  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(admissionForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.message || 'Error admitting student.');
      } else {
        setStatusMessage(`✅ ${data.message}`);
        setShowAdmissionModal(false);
        setAdmissionForm({
          name: '',
          rollNo: '',
          course: COURSE_OPTIONS[0],
          totalFees: 15000,
          monthlyFee: 2500,
          dueDay: 10,
          startDate: new Date().toISOString().slice(0, 10),
          durationMonths: 6,
          endDate: '',
          phone: '',
          email: '',
          guardianName: '',
          address: '',
        });
        loadData();
      }
    } catch (err) {
      alert('Failed to submit student admission.');
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id, name) => {
    if (!confirm(`Are you sure you want to delete student ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        setStatusMessage(`Student ${name} removed.`);
        loadData();
      }
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  // Collect Fee Submit
  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/fees/collect', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(feeForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.message || 'Error recording fee payment.');
      } else {
        setStatusMessage(`✅ Fee receipt ${data.data.receiptNo} created for ₹${data.data.amount}`);
        setShowFeeModal(false);
        setReceiptToPrint(data.data);
        loadData();
      }
    } catch (err) {
      alert('Failed to record fee payment.');
    }
  };

  // Quick Open Fee Modal for specific student
  const openFeeModalForStudent = (student) => {
    setSelectedStudentForFee(student);
    setFeeForm({
      studentId: student.id,
      rollNo: student.rollNo,
      studentName: student.name,
      amount: student.monthlyFee || '',
      paymentDate: new Date().toISOString().slice(0, 10),
      forMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      paymentMode: 'Cash',
      notes: `Monthly fee for ${student.name}`,
    });
    setShowFeeModal(true);
  };

  // Save Attendance Batch
  const handleSaveAttendance = async () => {
    const records = students.map((s) => ({
      studentId: s.id,
      rollNo: s.rollNo,
      studentName: s.name,
      status: attendanceRecords[s.id] || 'present',
    }));

    try {
      const res = await fetch('/api/admin/attendance/batch', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ date: attendanceDate, records }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMessage(`✅ Attendance saved for ${dateFormatted(attendanceDate)}`);
        loadData();
      }
    } catch (err) {
      alert('Failed to save attendance.');
    }
  };

  // Dispatch Fee Alert Reminders via Email
  const handleSendFeeReminders = async () => {
    try {
      const res = await fetch('/api/admin/fees/send-reminders', {
        method: 'POST',
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMessage(`📧 ${data.message}`);
      } else {
        alert(data.message || 'Failed to dispatch email reminders.');
      }
    } catch (err) {
      alert('Failed to trigger email reminders.');
    }
  };

  const dateFormatted = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      (s.phone && s.phone.includes(q)) ||
      s.course.toLowerCase().includes(q);
    const matchCourse = filterCourse === 'all' || s.course === filterCourse;
    return matchSearch && matchCourse;
  });

  /* -------------------------------------------------------------------------- */
  /* If not logged in, render the sleek login screen                            */
  /* -------------------------------------------------------------------------- */

  if (!token) {
    return (
      <div className="admin-page">
        <Seo title="Admin Portal — Special Learns Institute" description="Staff administrative panel for student admissions, fee tracking and attendance." path="/admin" />
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <span className="admin-login-badge">
                <Shield size={14} aria-hidden="true" />
                Institute Staff Only
              </span>
              <h1 className="admin-login-title">Admin Dashboard</h1>
              <p className="admin-login-subtitle">
                Enter your administrative credentials to manage student admissions, fee collections, and attendance.
              </p>
            </div>

            {loginError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="user-id">User ID</label>
                <input
                  id="user-id"
                  type="text"
                  className="admin-form-input"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="user-pass">Password</label>
                <input
                  id="user-pass"
                  type="password"
                  className="admin-form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                Sign In to Dashboard
                <ArrowRight size={16} />
              </button>

              <div className="admin-login-hint">
                <span>Demo User: <strong>admin</strong></span>
                <span>Password: <strong>admin123</strong></span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--sl-indigo-600)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin123');
                  }}
                >
                  Fill Demo
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/" style={{ color: 'var(--sl-text-muted)', fontSize: '0.84rem', textDecoration: 'none' }}>
                  ← Return to Institute Homepage
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* Main Logged-in Admin Dashboard                                             */
  /* -------------------------------------------------------------------------- */

  const upcomingAlerts = feeAlerts?.upcoming || [];
  const overdueAlerts = feeAlerts?.overdue || [];

  return (
    <div className="admin-page">
      <Seo title="Admin Dashboard — Special Learns Institute" description="Management portal for student admissions, fee tracking, and daily attendance." path="/admin" />

      <div className="admin-wrapper">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar__title">
            <span style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--sl-indigo-600)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
              SL
            </span>
            <div>
              <h1>Special Learns Admin</h1>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--sl-text-muted)' }}>
                Admissions, Fee Ledgers, Attendance & Alerts
              </p>
            </div>
          </div>

          <div className="admin-topbar__actions">
            <Link to="/attendance" target="_blank" className="admin-btn admin-btn--secondary">
              <ExternalLink size={14} />
              Student Check-in Portal
            </Link>
            <button type="button" onClick={loadData} className="admin-btn admin-btn--secondary" title="Refresh data">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button type="button" onClick={handleLogout} className="admin-btn admin-btn--danger">
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Global Toast Message */}
        {statusMessage && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 18px', borderRadius: '10px', color: '#065f46', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{statusMessage}</span>
            <button type="button" onClick={() => setStatusMessage(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#065f46' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="admin-nav-tabs" aria-label="Admin Sections">
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={16} />
            Dashboard Overview
          </button>
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'admissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('admissions')}
          >
            <Users size={16} />
            Student Admissions
            <span className="admin-nav-tab__count">{students.length}</span>
          </button>
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            <CreditCard size={16} />
            Fees Management
            {upcomingAlerts.length + overdueAlerts.length > 0 && (
              <span className="admin-nav-tab__count alert">
                {upcomingAlerts.length + overdueAlerts.length}
              </span>
            )}
          </button>
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <CalendarCheck size={16} />
            Attendance Register
          </button>
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            <Mail size={16} />
            Website Enquiries
            <span className="admin-nav-tab__count">{enquiries.length}</span>
          </button>
        </nav>

        {/* ================================================================== */}
        {/* TAB 1: OVERVIEW                                                    */}
        {/* ================================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* Metric Cards */}
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <div className="admin-metric-card__header">
                  <span className="admin-metric-card__label">Active Students</span>
                  <span className="admin-metric-card__icon"><Users size={20} /></span>
                </div>
                <div className="admin-metric-card__value">{overview?.totalStudents || students.length}</div>
                <div className="admin-metric-card__sub">Enrolled in lab courses</div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-card__header">
                  <span className="admin-metric-card__label">Collected This Month</span>
                  <span className="admin-metric-card__icon" style={{ background: '#ecfdf5', color: '#059669' }}><CreditCard size={20} /></span>
                </div>
                <div className="admin-metric-card__value" style={{ color: '#059669' }}>
                  ₹{(overview?.monthlyCollection || 0).toLocaleString()}
                </div>
                <div className="admin-metric-card__sub">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-card__header">
                  <span className="admin-metric-card__label">Fee Alerts (Due & Overdue)</span>
                  <span className="admin-metric-card__icon" style={{ background: '#fef3c7', color: '#d97706' }}><Bell size={20} /></span>
                </div>
                <div className="admin-metric-card__value" style={{ color: upcomingAlerts.length + overdueAlerts.length > 0 ? '#b45309' : 'inherit' }}>
                  {upcomingAlerts.length + overdueAlerts.length}
                </div>
                <div className="admin-metric-card__sub">{overdueAlerts.length} overdue, {upcomingAlerts.length} upcoming</div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-card__header">
                  <span className="admin-metric-card__label">Today's Attendance</span>
                  <span className="admin-metric-card__icon" style={{ background: '#f3e8ff', color: '#7e22ce' }}><CalendarCheck size={20} /></span>
                </div>
                <div className="admin-metric-card__value" style={{ color: '#7e22ce' }}>
                  {overview?.attendanceRate || 0}%
                </div>
                <div className="admin-metric-card__sub">
                  {overview?.todayPresentCount || 0} of {overview?.todayTotalCount || students.length} present today
                </div>
              </div>
            </div>

            {/* Fee Alerts Callout Banner */}
            {(upcomingAlerts.length > 0 || overdueAlerts.length > 0) && (
              <div className="admin-alert-banner">
                <div className="admin-alert-banner__top">
                  <div className="admin-alert-banner__title">
                    <Bell size={20} />
                    <span>Upcoming & Overdue Fee Reminders</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendFeeReminders}
                    className="admin-btn admin-btn--primary"
                    style={{ background: '#b45309' }}
                  >
                    <Send size={14} />
                    Send Fee Digest Email Alert
                  </button>
                </div>
                <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#92400e' }}>
                  The system automatically alerts on student fees due within 3 days (e.g. alert on 7th for 10th due date) and accounts past due:
                </p>

                <div className="admin-alert-items">
                  {overdueAlerts.map((s) => (
                    <div key={s.studentId} className="admin-alert-item overdue">
                      <div>
                        <strong>{s.name}</strong> <code style={{ fontSize: '0.75rem', background: '#fee2e2', padding: '1px 5px', borderRadius: 4 }}>{s.rollNo}</code> — {s.course}
                        <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 700, marginTop: 2 }}>
                          ⚠️ {s.message} · Amount: ₹{s.monthlyFee}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <a href={`tel:${s.phone}`} className="admin-btn admin-btn--secondary admin-btn--sm">
                          <Phone size={12} /> {s.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => openFeeModalForStudent(s)}
                          className="admin-btn admin-btn--primary admin-btn--sm"
                        >
                          Collect Fee
                        </button>
                      </div>
                    </div>
                  ))}

                  {upcomingAlerts.map((s) => (
                    <div key={s.studentId} className="admin-alert-item upcoming">
                      <div>
                        <strong>{s.name}</strong> <code style={{ fontSize: '0.75rem', background: '#fef3c7', padding: '1px 5px', borderRadius: 4 }}>{s.rollNo}</code> — {s.course}
                        <div style={{ color: '#b45309', fontSize: '0.8rem', fontWeight: 700, marginTop: 2 }}>
                          🔔 {s.message} · Amount: ₹{s.monthlyFee}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <a href={`tel:${s.phone}`} className="admin-btn admin-btn--secondary admin-btn--sm">
                          <Phone size={12} /> {s.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => openFeeModalForStudent(s)}
                          className="admin-btn admin-btn--primary admin-btn--sm"
                        >
                          Collect Fee
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Row */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                type="button"
                onClick={() => setShowAdmissionModal(true)}
                className="admin-btn admin-btn--primary"
              >
                <Plus size={16} />
                New Student Admission
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentForFee(null);
                  setFeeForm({
                    studentId: students[0]?.id || '',
                    amount: students[0]?.monthlyFee || 2500,
                    paymentDate: new Date().toISOString().slice(0, 10),
                    forMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    paymentMode: 'Cash',
                    notes: '',
                  });
                  setShowFeeModal(true);
                }}
                className="admin-btn admin-btn--secondary"
              >
                <CreditCard size={16} />
                Record Fee Payment
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className="admin-btn admin-btn--secondary"
              >
                <CalendarCheck size={16} />
                Take Today's Attendance
              </button>
            </div>

            {/* Recent Admissions & Payments Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
              <div className="admin-panel-card">
                <div className="admin-panel-card__header">
                  <h2 className="admin-panel-card__title">Recent Student Admissions</h2>
                  <button type="button" onClick={() => setActiveTab('admissions')} className="link-arrow" style={{ fontSize: '0.84rem' }}>
                    View All
                  </button>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Monthly Fee</th>
                        <th>Enrolled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((s) => (
                        <tr key={s.id}>
                          <td>
                            <strong>{s.name}</strong>
                            <br />
                            <small style={{ color: 'var(--sl-text-muted)' }}>{s.rollNo}</small>
                          </td>
                          <td style={{ fontSize: '0.82rem' }}>{s.course}</td>
                          <td><strong>₹{s.monthlyFee}</strong></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--sl-text-muted)' }}>{dateFormatted(s.startDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-card__header">
                  <h2 className="admin-panel-card__title">Recent Fee Receipts</h2>
                  <button type="button" onClick={() => setActiveTab('fees')} className="link-arrow" style={{ fontSize: '0.84rem' }}>
                    View Ledger
                  </button>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Receipt</th>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Month / Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.slice(0, 5).map((f) => (
                        <tr key={f.id}>
                          <td><code>{f.receiptNo}</code></td>
                          <td><strong>{f.studentName}</strong></td>
                          <td><strong style={{ color: '#059669' }}>₹{f.amount}</strong></td>
                          <td style={{ fontSize: '0.82rem' }}>
                            {f.forMonth}
                            <span style={{ display: 'inline-block', marginLeft: 6, fontSize: '0.72rem', background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>
                              {f.paymentMode}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: STUDENT ADMISSIONS                                          */}
        {/* ================================================================== */}
        {activeTab === 'admissions' && (
          <div className="admin-panel-card">
            <div className="admin-panel-card__header">
              <div>
                <h2 className="admin-panel-card__title">Student Directory & Admissions</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--sl-text-muted)' }}>
                  Manage enrolled students, course timings, fee schedules, and roll numbers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdmissionModal(true)}
                className="admin-btn admin-btn--primary"
              >
                <Plus size={16} />
                Take New Admission
              </button>
            </div>

            {/* Filter / Search Bar */}
            <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--sl-line)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 240px', position: 'relative' }}>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Search student name, roll number, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                />
                <Search size={16} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
              </div>

              <select
                className="admin-form-select"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                style={{ width: 'auto', minWidth: '200px' }}
              >
                <option value="all">All Courses</option>
                {COURSE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Course Duration</th>
                    <th>Fee Schedule</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--sl-text-muted)' }}>
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td><code>{s.rollNo}</code></td>
                        <td>
                          <strong>{s.name}</strong>
                          {s.guardianName && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--sl-text-muted)' }}>
                              C/O {s.guardianName}
                            </div>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--sl-indigo-700)' }}>
                            {s.course}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.84rem' }}>
                            <strong>{s.durationMonths} Months</strong>
                          </div>
                          <small style={{ color: 'var(--sl-text-muted)' }}>
                            {dateFormatted(s.startDate)} → {dateFormatted(s.endDate)}
                          </small>
                        </td>
                        <td>
                          <div>Monthly: <strong>₹{s.monthlyFee}</strong></div>
                          <small style={{ color: 'var(--sl-text-muted)' }}>
                            Total ₹{s.totalFees} · Due on {s.dueDay}th
                          </small>
                        </td>
                        <td>
                          {s.phone && (
                            <div>
                              <a href={`tel:${s.phone}`} style={{ color: 'var(--sl-indigo-600)', textDecoration: 'none', fontWeight: 600 }}>
                                {s.phone}
                              </a>
                            </div>
                          )}
                          {s.email && (
                            <small style={{ color: 'var(--sl-text-muted)' }}>{s.email}</small>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => openFeeModalForStudent(s)}
                              className="admin-btn admin-btn--primary admin-btn--sm"
                              title="Collect Fee"
                            >
                              <CreditCard size={12} /> Fee
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              className="admin-btn admin-btn--danger admin-btn--sm"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: FEES MANAGEMENT                                             */}
        {/* ================================================================== */}
        {activeTab === 'fees' && (
          <div>
            {/* Top Stats Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Total Collected (All Time)</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065f46', marginTop: 4 }}>
                  ₹{fees.reduce((sum, f) => sum + (f.amount || 0), 0).toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>Upcoming Dues (Next 3 Days)</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e', marginTop: 4 }}>
                  {upcomingAlerts.length} Students
                </div>
              </div>

              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 700 }}>Overdue Accounts</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginTop: 4 }}>
                  {overdueAlerts.length} Students
                </div>
              </div>
            </div>

            {/* Fee Alert Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Fee Ledger & Payment Receipts</h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--sl-text-muted)' }}>
                  Record payments, generate receipts, and track dues.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSendFeeReminders}
                  className="admin-btn admin-btn--secondary"
                >
                  <Send size={14} />
                  Send Reminder Emails
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentForFee(null);
                    setFeeForm({
                      studentId: students[0]?.id || '',
                      amount: 2500,
                      paymentDate: new Date().toISOString().slice(0, 10),
                      forMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                      paymentMode: 'Cash',
                      notes: '',
                    });
                    setShowFeeModal(true);
                  }}
                  className="admin-btn admin-btn--primary"
                >
                  <Plus size={16} />
                  Collect Fee Payment
                </button>
              </div>
            </div>

            {/* Fees Table */}
            <div className="admin-panel-card">
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Receipt No</th>
                      <th>Payment Date</th>
                      <th>Student Name</th>
                      <th>Roll No</th>
                      <th>Month Covered</th>
                      <th>Amount Paid</th>
                      <th>Payment Mode</th>
                      <th>Notes</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--sl-text-muted)' }}>
                          No fee payments recorded yet.
                        </td>
                      </tr>
                    ) : (
                      fees.map((f) => (
                        <tr key={f.id}>
                          <td><code>{f.receiptNo}</code></td>
                          <td>{dateFormatted(f.paymentDate)}</td>
                          <td><strong>{f.studentName}</strong></td>
                          <td><small>{f.rollNo}</small></td>
                          <td><span className="status-badge status-badge--paid">{f.forMonth}</span></td>
                          <td><strong style={{ color: '#059669', fontSize: '1rem' }}>₹{f.amount}</strong></td>
                          <td>{f.paymentMode}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--sl-text-muted)', maxWidth: 180 }}>{f.notes || '—'}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => setReceiptToPrint(f)}
                              className="admin-btn admin-btn--secondary admin-btn--sm"
                            >
                              <Printer size={12} /> View
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

        {/* ================================================================== */}
        {/* TAB 4: ATTENDANCE MANAGEMENT                                       */}
        {/* ================================================================== */}
        {activeTab === 'attendance' && (
          <div className="admin-panel-card">
            <div className="admin-panel-card__header">
              <div>
                <h2 className="admin-panel-card__title">Attendance Register</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--sl-text-muted)' }}>
                  Mark present/absent for classroom batches or view self-check-ins from the student kiosk.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="date"
                  className="admin-form-input"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  style={{ width: 'auto' }}
                />
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="admin-btn admin-btn--primary"
                >
                  <CheckCircle2 size={16} />
                  Save Register
                </button>
              </div>
            </div>

            {/* Batch Helpers */}
            <div style={{ padding: '0.75rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--sl-line)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sl-text-muted)' }}>Quick Actions:</span>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={() => {
                  const m = {};
                  students.forEach((s) => (m[s.id] = 'present'));
                  setAttendanceRecords(m);
                }}
              >
                Mark All Present
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={() => {
                  const m = {};
                  students.forEach((s) => (m[s.id] = 'absent'));
                  setAttendanceRecords(m);
                }}
              >
                Mark All Absent
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Today's Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const currentStatus = attendanceRecords[s.id] || 'present';
                    return (
                      <tr key={s.id}>
                        <td><code>{s.rollNo}</code></td>
                        <td><strong>{s.name}</strong></td>
                        <td><small>{s.course}</small></td>
                        <td>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setAttendanceRecords((prev) => ({ ...prev, [s.id]: 'present' }))}
                              className={`admin-btn admin-btn--sm ${currentStatus === 'present' ? 'admin-btn--success' : 'admin-btn--secondary'}`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttendanceRecords((prev) => ({ ...prev, [s.id]: 'absent' }))}
                              className={`admin-btn admin-btn--sm ${currentStatus === 'absent' ? 'admin-btn--danger' : 'admin-btn--secondary'}`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttendanceRecords((prev) => ({ ...prev, [s.id]: 'late' }))}
                              className={`admin-btn admin-btn--sm ${currentStatus === 'late' ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: WEBSITE ENQUIRIES                                           */}
        {/* ================================================================== */}
        {activeTab === 'enquiries' && (
          <div className="admin-panel-card">
            <div className="admin-panel-card__header">
              <div>
                <h2 className="admin-panel-card__title">Online Course Enquiries</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--sl-text-muted)' }}>
                  Incoming submissions from website visitors via the Contact page and Course popups.
                </p>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Course Interest</th>
                    <th>Contact Info</th>
                    <th>Note / Message</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--sl-text-muted)' }}>
                        No enquiries received yet.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((e) => (
                      <tr key={e.id}>
                        <td><strong>{e.name}</strong></td>
                        <td>
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: '0.82rem' }}>
                            {e.interest || 'General'}
                          </span>
                        </td>
                        <td>
                          {e.phone && <div><a href={`tel:${e.phone}`} style={{ color: 'var(--sl-indigo-600)', textDecoration: 'none', fontWeight: 600 }}>{e.phone}</a></div>}
                          {e.email && <small style={{ color: 'var(--sl-text-muted)' }}>{e.email}</small>}
                        </td>
                        <td style={{ fontSize: '0.82rem', maxWidth: 220 }}>{e.message || '—'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--sl-text-muted)' }}>{dateFormatted(e.receivedAt)}</td>
                        <td>
                          {e.phone && (
                            <a
                              href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-btn admin-btn--success admin-btn--sm"
                            >
                              WhatsApp
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MODAL: NEW STUDENT ADMISSION                                         */}
      {/* ==================================================================== */}
      {showAdmissionModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAdmissionModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <h3 className="admin-modal__title">New Student Admission</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--sl-text-muted)' }}>
                  Enroll learner, assign batch timing, course fee, and roll number.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdmissionModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdmissionSubmit}>
              <div className="admin-form-grid admin-form-grid--2col" style={{ marginBottom: '1rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="ad-roll">Roll Number (Optional - Auto generated if blank)</label>
                  <input
                    id="ad-roll"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. SL-2026-005"
                    value={admissionForm.rollNo}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, rollNo: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="ad-name">Student Full Name *</label>
                  <input
                    id="ad-name"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Gaurav Sharma"
                    value={admissionForm.name}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="ad-course">Select Course *</label>
                <select
                  id="ad-course"
                  className="admin-form-select"
                  value={admissionForm.course}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, course: e.target.value })}
                >
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Fee Structure */}
              <div className="admin-form-grid admin-form-grid--2col" style={{ marginBottom: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                <div className="admin-form-group">
                  <label htmlFor="ad-totalfee">Total Course Fee (₹) *</label>
                  <input
                    id="ad-totalfee"
                    type="number"
                    className="admin-form-input"
                    value={admissionForm.totalFees}
                    onChange={(e) => {
                      const total = Number(e.target.value) || 0;
                      const months = Number(admissionForm.durationMonths) || 1;
                      setAdmissionForm({
                        ...admissionForm,
                        totalFees: total,
                        monthlyFee: Math.round(total / months),
                      });
                    }}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="ad-monthlyfee">Monthly Fee (₹) *</label>
                  <input
                    id="ad-monthlyfee"
                    type="number"
                    className="admin-form-input"
                    value={admissionForm.monthlyFee}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, monthlyFee: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="ad-dueday">Fee Due Day of Month</label>
                  <input
                    id="ad-dueday"
                    type="number"
                    min="1"
                    max="31"
                    className="admin-form-input"
                    placeholder="10"
                    value={admissionForm.dueDay}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, dueDay: Number(e.target.value) })}
                  />
                  <small style={{ color: 'var(--sl-text-muted)', fontSize: '0.72rem' }}>
                    Alerts trigger 3 days prior (e.g. 7th for 10th).
                  </small>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="ad-duration">Duration (Months) *</label>
                  <select
                    id="ad-duration"
                    className="admin-form-select"
                    value={admissionForm.durationMonths}
                    onChange={(e) => handleDurationChange(e.target.value)}
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months</option>
                    <option value="4">4 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months (1 Year)</option>
                  </select>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="admin-form-grid admin-form-grid--2col" style={{ marginBottom: '1rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="ad-start">Course Start Date *</label>
                  <input
                    id="ad-start"
                    type="date"
                    className="admin-form-input"
                    value={admissionForm.startDate}
                    onChange={(e) => {
                      const start = e.target.value;
                      let endStr = '';
                      if (start) {
                        const d = new Date(start);
                        d.setMonth(d.getMonth() + Number(admissionForm.durationMonths || 1));
                        endStr = d.toISOString().slice(0, 10);
                      }
                      setAdmissionForm({ ...admissionForm, startDate: start, endDate: endStr });
                    }}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="ad-end">Course End Date</label>
                  <input
                    id="ad-end"
                    type="date"
                    className="admin-form-input"
                    value={admissionForm.endDate}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Student Contact */}
              <div className="admin-form-grid admin-form-grid--2col" style={{ marginBottom: '1.25rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="ad-phone">Phone Number *</label>
                  <input
                    id="ad-phone"
                    type="tel"
                    className="admin-form-input"
                    placeholder="98765 43210"
                    value={admissionForm.phone}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="ad-email">Email Address</label>
                  <input
                    id="ad-email"
                    type="email"
                    className="admin-form-input"
                    placeholder="student@example.com"
                    value={admissionForm.email}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="ad-address">Residential Address / Remarks</label>
                <input
                  id="ad-address"
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Uttam Nagar, New Delhi"
                  value={admissionForm.address}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  className="admin-btn admin-btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                >
                  Confirm Student Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: COLLECT FEE PAYMENT                                           */}
      {/* ==================================================================== */}
      {showFeeModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowFeeModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <h3 className="admin-modal__title">Record Fee Payment</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--sl-text-muted)' }}>
                  Collect monthly installment, generate official receipt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFeeModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFeeSubmit}>
              <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="fee-student">Select Student *</label>
                <select
                  id="fee-student"
                  className="admin-form-select"
                  value={feeForm.studentId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    const st = students.find((s) => s.id === sid);
                    setFeeForm({
                      ...feeForm,
                      studentId: sid,
                      rollNo: st?.rollNo || '',
                      studentName: st?.name || '',
                      amount: st?.monthlyFee || feeForm.amount,
                    });
                  }}
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) — {s.course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-grid admin-form-grid--2col" style={{ marginBottom: '1rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="fee-amount">Amount Paid (₹) *</label>
                  <input
                    id="fee-amount"
                    type="number"
                    className="admin-form-input"
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="fee-month">Month Covered *</label>
                  <input
                    id="fee-month"
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. October 2026"
                    value={feeForm.forMonth}
                    onChange={(e) => setFeeForm({ ...feeForm, forMonth: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-grid admin-form-grid--2col" style={{ marginBottom: '1rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="fee-mode">Payment Method</label>
                  <select
                    id="fee-mode"
                    className="admin-form-select"
                    value={feeForm.paymentMode}
                    onChange={(e) => setFeeForm({ ...feeForm, paymentMode: e.target.value })}
                  >
                    <option value="Cash">Cash (Reception)</option>
                    <option value="UPI">UPI / Google Pay / PhonePe / Paytm</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="fee-date">Payment Date</label>
                  <input
                    id="fee-date"
                    type="date"
                    className="admin-form-input"
                    value={feeForm.paymentDate}
                    onChange={(e) => setFeeForm({ ...feeForm, paymentDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="fee-notes">Payment Notes / Remarks</label>
                <input
                  id="fee-notes"
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Received via PhonePe transaction #1234"
                  value={feeForm.notes}
                  onChange={(e) => setFeeForm({ ...feeForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowFeeModal(false)}
                  className="admin-btn admin-btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: PRINTABLE RECEIPT PREVIEW                                     */}
      {/* ==================================================================== */}
      {receiptToPrint && (
        <div className="admin-modal-backdrop" onClick={() => setReceiptToPrint(null)}>
          <div className="admin-modal" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
              {/* Receipt Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.4rem', color: '#1e293b' }}>Special Learns Institute</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  K-3, Mohan Garden, 40 Feet Road, Uttam Nagar, New Delhi 110059
                </p>
                <span style={{ display: 'inline-block', marginTop: 8, padding: '2px 10px', background: '#ecfdf5', color: '#065f46', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800 }}>
                  OFFICIAL FEE RECEIPT
                </span>
              </div>

              {/* Receipt Details */}
              <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse', marginBottom: '16px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Receipt No:</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700 }}><code>{receiptToPrint.receiptNo}</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Date:</td>
                    <td style={{ padding: '6px 0', textAlign: 'right' }}>{dateFormatted(receiptToPrint.paymentDate)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Student Name:</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700 }}>{receiptToPrint.studentName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Roll Number:</td>
                    <td style={{ padding: '6px 0', textAlign: 'right' }}><code>{receiptToPrint.rollNo}</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Month:</td>
                    <td style={{ padding: '6px 0', textAlign: 'right' }}>{receiptToPrint.forMonth}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>Payment Mode:</td>
                    <td style={{ padding: '6px 0', textAlign: 'right' }}>{receiptToPrint.paymentMode}</td>
                  </tr>
                  {receiptToPrint.notes && (
                    <tr>
                      <td style={{ padding: '6px 0', color: '#64748b' }}>Remarks:</td>
                      <td style={{ padding: '6px 0', textAlign: 'right', fontSize: '0.8rem' }}>{receiptToPrint.notes}</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '2px solid #0f172a' }}>
                    <td style={{ padding: '12px 0 6px', fontWeight: 800, fontSize: '1.1rem' }}>Total Amount Paid:</td>
                    <td style={{ padding: '12px 0 6px', textAlign: 'right', fontWeight: 800, fontSize: '1.25rem', color: '#059669' }}>
                      ₹{receiptToPrint.amount}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                Thank you for your payment! Keep this receipt for your records.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setReceiptToPrint(null)}
                className="admin-btn admin-btn--secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="admin-btn admin-btn--primary"
              >
                <Printer size={16} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
