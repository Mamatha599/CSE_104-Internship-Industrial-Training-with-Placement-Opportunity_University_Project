import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import DashboardCard from '../../components/DashboardCard';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalOpportunities: 0,
        totalApplications: 0,
        totalPlacedStudents: 0
    });
    const [users, setUsers] = useState([]);
    const [students, setStudents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [studentSearch, setStudentSearch] = useState('');
    const [appSearch, setAppSearch] = useState('');
    const navigate = useNavigate();

    // Export Logic
    const handleExport = async (type, id = null) => {
        try {
            const url = type === 'students' ? '/export/students' : `/export/applicants/${id}`;
            const response = await api.get(url, { responseType: 'blob' });
            
            // Create a link and trigger download
            const blob = new Blob([response.data], { type: 'text/csv' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', type === 'students' ? 'student_registry.csv' : 'applicants_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to generate export file.');
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, appsRes, usersRes, studentsRes, analyticsRes] = await Promise.all([
                    api.get('/placement/dashboard'),
                    api.get('/placement/applications'),
                    api.get('/auth'),
                    api.get('/student/all'),
                    api.get('/analytics/placement')
                ]);

                setStats({ ...statsRes.data.data, analytics: analyticsRes.data.data });
                setApplications(appsRes.data.data);
                setUsers(usersRes.data.data);
                setStudents(studentsRes.data.data);
            } catch (err) {
                console.error('Error fetching admin dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [refreshTrigger]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await api.post('/admin/assign-role', { userId, role: newRole });
            setRefreshTrigger(prev => prev + 1);
            alert('User role updated successfully');
        } catch (err) {
            console.error('Error updating role', err);
            alert('Failed to update role');
        }
    };

    const handleFacultyAssign = async (studentId, facultyId) => {
        try {
            await api.post('/admin/assign-faculty', { facultyId, studentIds: [studentId] });
            setRefreshTrigger(prev => prev + 1);
            alert('Faculty assigned successfully');
        } catch (err) {
            console.error('Error assigning faculty', err);
            alert('Failed to assign faculty');
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        setUpdatingId(applicationId);
        try {
            await api.put(`/placement/application-status/${applicationId}`, { status: newStatus });
            // Update local state
            setApplications(prev => prev.map(app => 
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));
            // Also update stats if someone was selected or unselected
            const statsRes = await api.get('/placement/dashboard');
            setStats(statsRes.data.data);
        } catch (err) {
            console.error('Error updating status', err);
            alert('Failed to update application status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div className="loader">Synchronizing Administrative Data...</div>
        </div>
    );

    const statusOptions = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED'];
    const roleOptions = ['student', 'faculty', 'coordinator', 'hod', 'dean', 'recruiter', 'admin'];

    return (
        <div className="page-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.25rem', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                        CENTRAL PLACEMENT CONTROL
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Administrative Authority Panel • Global Oversight & Policy Monitoring</p>
                </div>
                <button
                    onClick={() => navigate('/create-opportunity')}
                    className="btn-primary"
                    style={{ padding: '0.85rem 1.75rem', fontWeight: '850' }}
                >
                    + INITIALIZE OPPORTUNITY
                </button>
            </header>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div className="linways-card" style={{ borderTop: '4px solid var(--primary)' }}>
                    <div className="linways-card-header">
                        <h4>TOTAL STUDENTS</h4>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: 'var(--text-main)' }}>{stats.totalStudents}</div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Registered Candidates</p>
                </div>
                <div className="linways-card" style={{ borderTop: '4px solid #3b82f6' }}>
                    <div className="linways-card-header">
                        <h4>OPPORTUNITIES</h4>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: '#3b82f6' }}>{stats.totalOpportunities}</div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Active Listings</p>
                </div>
                <div className="linways-card" style={{ borderTop: '4px solid #f59e0b' }}>
                    <div className="linways-card-header">
                        <h4>APPLICATIONS</h4>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: '#f59e0b' }}>{stats.totalApplications}</div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Submissions Received</p>
                </div>
                <div className="linways-card" style={{ borderTop: '4px solid #10b981' }}>
                    <div className="linways-card-header">
                        <h4>PLACED STUDENTS</h4>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: '#10b981' }}>{stats.totalPlacedStudents}</div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Hired via Portal</p>
                </div>
                {/* Selection Rate - NEW METRIC */}
                <div className="linways-card" style={{ borderTop: '4px solid #8b5cf6', background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)' }}>
                    <div className="linways-card-header">
                        <h4 style={{ color: '#8b5cf6' }}>SELECTION RATE</h4>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: '#8b5cf6' }}>
                        {stats.analytics?.selectionRate || '0'}<span style={{ fontSize: '0.8rem' }}>%</span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: '#7c3aed', marginTop: '0.5rem', fontWeight: '700' }}>Pipeline Efficiency</p>
                </div>

                {/* Approval Rate */}
                <div className="linways-card" style={{ borderTop: '4px solid #10b981', background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)' }}>
                    <div className="linways-card-header">
                        <h4 style={{ color: '#059669' }}>APPROVAL RATE</h4>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: '#059669' }}>
                        {stats.analytics?.approvalRate || '0'}<span style={{ fontSize: '0.8rem' }}>%</span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: '#059669', marginTop: '0.5rem', fontWeight: '700' }}>Institutional Success</p>
                </div>

                {/* ADVANCED ANALYTICS LINK */}
                <div 
                    onClick={() => navigate('/analytics')}
                    className="linways-card" 
                    style={{ 
                        borderTop: '4px solid var(--primary)', 
                        background: 'var(--primary)', 
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        transition: 'transform 0.2s ease'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📈</div>
                    <div style={{ fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1px' }}>VIEW FULL ANALYTICS</div>
                    <p style={{ fontSize: '0.6rem', opacity: 0.8 }}>Deep Institutional Insights</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div className="linways-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <div className="linways-card-header"><h4>PENDING APPROVALS (GLOBAL)</h4></div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '1000', color: '#ef4444' }}>{stats.analytics?.approvalPending || 0}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>REQUESTS AWAITING SIGNATURE</span>
                    </div>
                </div>
                <div className="linways-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div className="linways-card-header"><h4>COMPLETED INTERNSHIPS</h4></div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '1000', color: 'var(--primary)' }}>{stats.analytics?.approvalCompleted || 0}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL FINALIZED</span>
                    </div>
                </div>
            </div>

            {/* ══ User Role Management ═════════════════════════════════════════ */}
            <div className="linways-card" style={{ marginBottom: '2.5rem' }}>
                <div className="linways-card-header">
                    <h4>USER ROLE MANAGEMENT</h4>
                </div>
                <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>EMAIL</th>
                                <th>CURRENT ROLE</th>
                                <th>CHANGE ROLE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className="badge" style={{ background: '#e2e8f0', color: '#475569', fontWeight: '800' }}>
                                            {u.role?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            value={u.role}
                                            onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                                            style={{ padding: '0.3rem', borderRadius: '4px', fontSize: '0.8rem' }}
                                        >
                                            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══ Faculty Mentor Assignment ═══════════════════════════════════ */}
            <div className="linways-card" style={{ marginBottom: '2.5rem' }}>
                <div className="linways-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>FACULTY MENTOR ASSIGNMENT</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="text" 
                            placeholder="Search Student/Roll No..." 
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}
                        />
                        <button 
                            onClick={() => handleExport('students')}
                            className="btn-outline"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: '800' }}
                        >
                            ⬇ EXPORT REGISTRY
                        </button>
                    </div>
                </div>
                <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>CURRENT MENTOR</th>
                                <th>ASSIGN NEW MENTOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students
                                .filter(s => 
                                    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                    s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
                                )
                                .map(s => {
                                    const currentMentor = users.find(u => u._id === s.assignedFaculty);
                                    const facultyUsers = users.filter(u => u.role === 'faculty');
                                    
                                    return (
                                        <tr key={s._id}>
                                            <td>
                                                <div style={{ fontWeight: '700' }}>{s.name}</div>
                                                <div style={{ fontSize: '0.7rem' }}>{s.rollNumber}</div>
                                            </td>
                                            <td>
                                                {currentMentor ? (
                                                    <span style={{ fontWeight: '600', color: 'var(--success)' }}>{currentMentor.email}</span>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>Not Assigned</span>
                                                )}
                                            </td>
                                            <td>
                                                <select 
                                                    value={s.assignedFaculty || ''}
                                                    onChange={(e) => handleFacultyAssign(s._id, e.target.value)}
                                                    style={{ padding: '0.3rem', borderRadius: '4px', fontSize: '0.8rem' }}
                                                >
                                                    <option value="">Select Faculty...</option>
                                                    {facultyUsers.map(f => (
                                                        <option key={f._id} value={f._id}>{f.email}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Applications Management Table */}
            <div className="linways-card">
                <div className="linways-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h4>MONITOR APPLICATIONS</h4>
                        <input 
                            type="text" 
                            placeholder="Filter by Student/Company..." 
                            value={appSearch}
                            onChange={(e) => setAppSearch(e.target.value)}
                            style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}
                        />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL {applications.length} SUBMISSIONS</span>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>STUDENT NAME</th>
                                <th>COMPANY</th>
                                <th>ROLE</th>
                                <th>CURRENT STATUS</th>
                                <th>UPDATE LIFECYCLE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications
                                .filter(app => 
                                    app.studentId?.name?.toLowerCase().includes(appSearch.toLowerCase()) || 
                                    app.opportunityId?.companyName?.toLowerCase().includes(appSearch.toLowerCase())
                                )
                                .map(app => (
                                    <tr key={app._id}>
                                    <td>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{app.studentId?.name || 'Unknown Student'}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{app.studentId?.rollNumber} • {app.studentId?.department}</div>
                                    </td>
                                    <td>
                                        <strong style={{ color: 'var(--primary)' }}>{app.opportunityId?.companyName?.toUpperCase()}</strong>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: '600' }}>{app.opportunityId?.title}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${app.status?.toLowerCase().replace(' ', '-') || 'applied'}`} style={{
                                            fontSize: '0.7rem', fontWeight: '800', padding: '4px 12px', borderRadius: '999px',
                                            textTransform: 'uppercase', letterSpacing: '0.5px'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            value={app.status} 
                                            disabled={updatingId === app._id}
                                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: '#f8fafc',
                                                cursor: 'pointer',
                                                outline: 'none'
                                            }}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No applications found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
