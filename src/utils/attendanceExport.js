/**
 * Utility to generate and download attendance reports as CSV files
 * formatted for Microsoft Excel, Apple Numbers, and Google Sheets.
 */

/**
 * Escapes a field for safe CSV output according to RFC 4180
 */
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Triggers a browser download of CSV content with UTF-8 BOM
 */
export function triggerCsvDownload(csvContent, filename) {
  // UTF-8 BOM (\uFEFF) ensures Excel correctly displays special characters
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates and downloads a CSV of attendance records for a specific date or set
 *
 * @param {Object} options
 * @param {Array} options.students - List of student objects
 * @param {Object} options.attendanceRecords - Map of studentId -> status ('present'|'absent'|'late')
 * @param {string} options.date - The attendance date (YYYY-MM-DD)
 * @param {string} [options.filterStatus='all'] - 'all' | 'present' | 'absent' | 'late' | 'absent_late'
 * @param {Array} [options.serverRecords=[]] - Optional server attendance objects with timestamp/source
 */
export function exportDailyAttendanceCsv({
  students = [],
  attendanceRecords = {},
  date = new Date().toISOString().slice(0, 10),
  filterStatus = 'all',
  serverRecords = [],
}) {
  // Map of server records for timestamp / source
  const serverMap = new Map();
  for (const rec of serverRecords) {
    if (rec.studentId) serverMap.set(rec.studentId, rec);
    if (rec.rollNo) serverMap.set(rec.rollNo, rec);
  }

  // Filter students based on filterStatus
  const rows = [];
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  for (const s of students) {
    const rawStatus = attendanceRecords[s.id] || 'present';
    if (rawStatus === 'present') presentCount++;
    else if (rawStatus === 'absent') absentCount++;
    else if (rawStatus === 'late') lateCount++;

    let include = true;
    if (filterStatus === 'present') include = rawStatus === 'present';
    else if (filterStatus === 'absent') include = rawStatus === 'absent';
    else if (filterStatus === 'late') include = rawStatus === 'late';
    else if (filterStatus === 'absent_late') include = rawStatus === 'absent' || rawStatus === 'late';

    if (include) {
      const srv = serverMap.get(s.id) || serverMap.get(s.rollNo);
      const timeStr = srv?.timestamp
        ? new Date(srv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '-';
      const sourceStr = srv?.source === 'student' ? 'Student Kiosk (Self)' : 'Admin Register';

      rows.push({
        date,
        rollNo: s.rollNo,
        name: s.name,
        course: s.course,
        phone: s.phone || '',
        status: rawStatus.toUpperCase(),
        time: timeStr,
        source: sourceStr,
      });
    }
  }

  // Build CSV
  const lines = [
    `# Special Learns Institute — Daily Attendance Register`,
    `# Date: ${date} | Filter: ${filterStatus.toUpperCase()}`,
    `# Total Enrolled: ${students.length} | Present: ${presentCount} | Absent: ${absentCount} | Late: ${lateCount}`,
    ``,
    [
      escapeCsv('Date'),
      escapeCsv('Roll Number'),
      escapeCsv('Student Name'),
      escapeCsv('Course'),
      escapeCsv('Contact Phone'),
      escapeCsv('Attendance Status'),
      escapeCsv('Check-in Time'),
      escapeCsv('Marked Source'),
    ].join(','),
  ];

  for (const r of rows) {
    lines.push([
      escapeCsv(r.date),
      escapeCsv(r.rollNo),
      escapeCsv(r.name),
      escapeCsv(r.course),
      escapeCsv(r.phone),
      escapeCsv(r.status),
      escapeCsv(r.time),
      escapeCsv(r.source),
    ].join(','));
  }

  const csvContent = lines.join('\r\n');
  const filename = `SpecialLearns_Attendance_${date}_${filterStatus}.csv`;
  triggerCsvDownload(csvContent, filename);
  return { filename, count: rows.length };
}

/**
 * Exports complete historical attendance register across all dates
 */
export function exportHistoricalAttendanceCsv(records = [], students = []) {
  const studentMap = new Map();
  for (const s of students) {
    studentMap.set(s.id, s);
    studentMap.set(s.rollNo, s);
  }

  const lines = [
    `# Special Learns Institute — Comprehensive Attendance History`,
    `# Generated: ${new Date().toLocaleString('en-IN')}`,
    `# Total Historical Logs: ${records.length}`,
    ``,
    [
      escapeCsv('Date'),
      escapeCsv('Roll Number'),
      escapeCsv('Student Name'),
      escapeCsv('Course'),
      escapeCsv('Status'),
      escapeCsv('Time'),
      escapeCsv('Marked Source'),
      escapeCsv('Record ID'),
    ].join(','),
  ];

  // Sort descending by date
  const sorted = [...records].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  for (const r of sorted) {
    const stu = studentMap.get(r.studentId) || studentMap.get(r.rollNo);
    const timeStr = r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
    lines.push([
      escapeCsv(r.date || ''),
      escapeCsv(r.rollNo || stu?.rollNo || ''),
      escapeCsv(r.studentName || stu?.name || ''),
      escapeCsv(stu?.course || 'General'),
      escapeCsv((r.status || 'present').toUpperCase()),
      escapeCsv(timeStr),
      escapeCsv(r.source === 'student' ? 'Student Kiosk' : 'Admin Register'),
      escapeCsv(r.id || ''),
    ].join(','));
  }

  const csvContent = lines.join('\r\n');
  const filename = `SpecialLearns_Attendance_Full_History_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerCsvDownload(csvContent, filename);
  return { filename, count: sorted.length };
}
