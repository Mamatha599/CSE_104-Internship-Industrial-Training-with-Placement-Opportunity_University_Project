import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

// ── Placement stat card ──────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, description, color }) => (
    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ fontSize: '0.7rem', fontWeight: '850', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{title}</p>
                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--primary)', lineHeight: '1' }}>{value}</div>
            </div>
            <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '1px solid var(--border-color)' }}>{icon}</div>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: 'auto' }}>{description}</p>
    </div>
);

// ── Status badge colour map ─────────────────────────────────────────────────
const statusStyle = (status) => {
    const s = (status || '').toUpperCase();
    const map = {
        APPLIED: { background: '#e2e8f0', color: '#475569' },
        SHORTLISTED: { background: '#eff6ff', color: '#2563eb' },
        SELECTED: { background: '#d1fae5', color: '#059669' },
        REJECTED: { background: '#fee2e2', color: '#dc2626' },
    };
    return map[s] || map['APPLIED'];
};

// ── Dashboard Component ────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({ total: 0, applied: 0, shortlisted: 0, selected: 0 });
    const [loading, setLoading] = useState(true);
    const [applyModal, setApplyModal] = useState({ show: false, success: true, message: '' });
    const { user } = useAuth();
    const navigate = useNavigate();
    const { notifications, markRead, clearAll: clearAllNotifs } = useNotifications();

    useEffect(() => {
        const timer = setTimeout(() => { fetchAll(); }, 300);
        return () => clearTimeout(timer);
    }, []);

    const fetchAll = async () => {
        try {
            const [profileRes, oppsRes, appsRes] = await Promise.allSettled([
                api.get('/student/profile'),
                api.get('/opportunity/student-feed'),
                api.get('/application/my?type=Placement'),
            ]);

            const prof = profileRes.status === 'fulfilled' ? profileRes.value.data.data : null;
            const opps = oppsRes.status === 'fulfilled' ? oppsRes.value.data.data : [];
            const apps = appsRes.status === 'fulfilled' ? appsRes.value.data.data : [];

            // Filter to show only Placement-type opportunities (handle both case cases)
            const usedOpps = (opps || []).filter(o => 
                (o.type || '').toLowerCase() === 'placement'
            );
            const usedApps = apps || [];

            setProfile(prof);
            setOpportunities(usedOpps);
            setApplications(usedApps);
            setStats({
                total: usedOpps.length,
                applied: usedApps.length,
                shortlisted: usedApps.filter(a => (a.status || '').toUpperCase() === 'SHORTLISTED').length,
                selected: usedApps.filter(a => (a.status || '').toUpperCase() === 'SELECTED').length,
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setOpportunities([]);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (opportunityId) => {
        try {
            await api.post(`/application/apply/${opportunityId}`);
            setApplyModal({ show: true, success: true, message: 'Application submitted successfully! We will notify you of updates.' });
            fetchAll();
        } catch (err) {
            setApplyModal({ show: true, success: false, message: err.response?.data?.message || 'Error submitting application. Please try again.' });
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loader">Synchronizing Student Data...</div>
        </div>
    );

    const resumeUploaded = !!(profile?.resume || profile?.resumeURL);

    return (
        <div className="page-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

            {/* ══ BACK TO PORTAL + HEADER ════════════════════════════════════ */}
            <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '1.25rem' }}>
                <button 
                    onClick={() => navigate('/')} 
                    className="btn-outline"
                    style={{ padding: '6px 14px', fontSize: '0.72rem', marginBottom: '1.5rem', fontWeight: '850' }}
                >
                    ← RETURN TO SECTOR SELECTION
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>OFFICIAL PLACEMENT GATEWAY</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Employment & Recruitment Management System</p>
            </div>

            {/* ══ SECTION 1 · PROFILE SUMMARY ══════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                <div className="linways-profile-banner">
                    <div className="linways-avatar-container">
                        <div className="linways-avatar-inner">
                            {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'S'}
                        </div>
                    </div>
                    <div className="linways-profile-details">
                        <p style={{ opacity: 0.7, letterSpacing: '2px', fontWeight: '800', fontSize: '0.75rem' }}>OFFICIAL ACADEMIC PROFILE</p>
                        <h2>{profile?.name || user?.name || 'STUDENT NAME'}</h2>
                        <div style={{ display: 'flex', gap: '2rem', opacity: 0.9, fontSize: '0.9rem', flexWrap: 'wrap' }}>
                            <p><strong>ROLL&nbsp;NO:</strong>&nbsp;{profile?.rollNumber || '2021CS001'}</p>
                            <p><strong>DEPT:</strong>&nbsp;{(profile?.department || 'Computer Science').toUpperCase()}</p>
                            <p><strong>YEAR:</strong>&nbsp;{profile?.year || '4th Year'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', opacity: 0.9, fontSize: '0.9rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <p><strong>EMAIL:</strong>&nbsp;{profile?.email || user?.email || 'student@college.edu'}</p>
                            <p>
                                <strong>RESUME:</strong>&nbsp;
                                <span style={{
                                    fontSize: '0.7rem', padding: '2px 10px', borderRadius: '4px', fontWeight: '800',
                                    background: resumeUploaded ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                                    color: resumeUploaded ? '#10b981' : '#ef4444',
                                }}>
                                    {resumeUploaded ? '✓ UPLOADED' : '✗ NOT UPLOADED'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>HOUR-WISE ATTENDANCE</h4>
                    </div>
                    <div className="attendance-ring-container">
                        <div className="attendance-ring">
                            <span className="attendance-ring-value">78%</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '700', letterSpacing: '0.5px' }}>
                            VIEW FULL LOGS
                        </p>
                    </div>
                </div>
            </div>

            {/* ══ SECTION 2 · PLACEMENT STATISTICS CARDS ═══════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <StatCard icon="💼" title="Total Opportunities" value={stats.total} description="Active internships & placements available" color="#7c3aed" />
                <StatCard icon="📨" title="Applications Submitted" value={stats.applied} description="Total applications you have sent" color="#3b82f6" />
                <StatCard icon="⭐" title="Shortlisted" value={stats.shortlisted} description="Applications moved to shortlist stage" color="#f59e0b" />
                <StatCard icon="🏆" title="Offers Received" value={stats.selected} description="Companies that have selected you" color="#10b981" />
            </div>

            {/* ══ SECTION 3 · OPPORTUNITIES TABLE ══════════════════════════════ */}
            <div className="linways-card" style={{ marginBottom: '2.5rem' }}>
                <div className="linways-card-header">
                    <h4>AVAILABLE OPPORTUNITIES</h4>
                    <span onClick={() => navigate('/opportunities')} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800', cursor: 'pointer' }}>VIEW ALL →</span>
                </div>
                {opportunities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>📁</div>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>No active opportunities at this time.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>COMPANY</th>
                                    <th>ROLE / POSITION</th>
                                    <th>TYPE</th>
                                    <th>MATCH %</th>
                                    <th>REQUIRED SKILLS</th>
                                    <th>DEADLINE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {opportunities.slice(0, 5).map((opp) => {
                                    const labelColor = opp.matchPercentage > 70 ? '#059669' : opp.matchPercentage >= 40 ? '#d97706' : '#dc2626';
                                    const labelBg = opp.matchPercentage > 70 ? '#d1fae5' : opp.matchPercentage >= 40 ? '#fef3c7' : '#fee2e2';

                                    return (
                                        <tr key={opp._id}>
                                            <td>
                                                <strong style={{ color: 'var(--primary)' }}>{opp.companyName?.toUpperCase()}</strong>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{opp.title}</span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    fontSize: '0.7rem', fontWeight: '800', padding: '3px 10px', borderRadius: '4px',
                                                    background: 'rgba(124,58,237,0.1)', color: 'var(--primary)',
                                                }}>
                                                    {opp.type?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ 
                                                    padding: '2px 8px', borderRadius: '6px', background: labelBg, 
                                                    color: labelColor, fontSize: '0.65rem', fontWeight: '900', textAlign: 'center',
                                                    display: 'inline-block'
                                                }}>
                                                    {opp.matchPercentage}%
                                                </div>
                                            </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                {opp.requiredSkills?.slice(0, 3).map(skill => (
                                                    <span key={skill} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>
                                            {new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                         <td style={{ display: 'flex', gap: '0.4rem' }}>
                                             <button
                                                 className="btn-outline"
                                                 style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: '850' }}
                                                 onClick={() => navigate(`/opportunities/${opp._id}`)}
                                             >
                                                 DETAILS
                                             </button>
                                             <button
                                                 className="btn-primary"
                                                 style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: '850' }}
                                                 onClick={() => handleApply(opp._id)}
                                             >
                                                 PROCEED
                                             </button>
                                         </td>
                                    </tr>
                                );})}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ══ SECTION 4 · APPLICATION STATUS TABLE ═════════════════════════ */}
            <div className="linways-card" style={{ marginBottom: '2.5rem' }}>
                <div className="linways-card-header">
                    <h4>MY APPLICATION STATUS</h4>
                    <span onClick={() => navigate('/my-applications')} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800', cursor: 'pointer' }}>VIEW ALL →</span>
                </div>
                {applications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>📫</div>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>No applications submitted yet.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>COMPANY</th>
                                    <th>ROLE</th>
                                    <th>APPLIED ON</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.slice(0, 6).map((app) => {
                                    const s = statusStyle(app.status);
                                    return (
                                        <tr key={app._id}>
                                            <td>
                                                <strong style={{ color: 'var(--primary)' }}>
                                                    {app.opportunityId?.companyName?.toUpperCase()}
                                                </strong>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                                                    {app.opportunityId?.title}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
                                                {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td>
                                                <span style={{
                                                    ...s,
                                                    fontSize: '0.72rem', fontWeight: '800',
                                                    padding: '4px 12px', borderRadius: '999px',
                                                    letterSpacing: '0.5px', display: 'inline-block',
                                                }}>
                                                    {app.status?.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ══ SECTION 5 · STUDENT SKILLS DISPLAY ═════════════════════════ */}
            <div className="linways-card" style={{ marginBottom: '2.5rem' }}>
                <div className="linways-card-header">
                    <h4>SKILLS</h4>
                    <a href="/profile" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>MANAGE SKILLS →</a>
                </div>
                {(profile?.skills && profile.skills.length > 0) ? (
                    <div className="skills-container">
                        {profile.skills.map((skill, idx) => (
                            <span key={idx} className="skill-badge">{skill}</span>
                        ))}
                    </div>
                ) : (
                    <div className="section-empty-state">
                        <div className="empty-icon">🎯</div>
                        <p>Add skills to improve opportunity matching.</p>
                    </div>
                )}
            </div>

            {/* ══ SECTION 6 · RECOMMENDED OPPORTUNITIES ══════════════════════ */}
            <div className="linways-card" style={{ marginBottom: '2.5rem' }}>
                <div className="linways-card-header">
                    <h4>RECOMMENDED OPPORTUNITIES</h4>
                    <span onClick={() => navigate('/opportunities')} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800', cursor: 'pointer' }}>VIEW ALL →</span>
                </div>
                {opportunities.length === 0 ? (
                    <div className="section-empty-state">
                        <div className="empty-icon">💡</div>
                        <p>No matching opportunities found. Add more skills to get recommendations.</p>
                    </div>
                ) : (
                    <div className="recommendation-list">
                        {opportunities.slice(0, 5).map(opp => {
                            const labelColor = opp.matchPercentage > 70 ? '#059669' : opp.matchPercentage >= 40 ? '#d97706' : '#dc2626';
                            const labelBg = opp.matchPercentage > 70 ? '#d1fae5' : opp.matchPercentage >= 40 ? '#fef3c7' : '#fee2e2';

                            return (
                                <div key={opp._id} className="recommendation-card" style={{ position: 'relative' }}>
                                    <div style={{ 
                                        position: 'absolute', top: '1rem', right: '1rem',
                                        padding: '4px 10px', borderRadius: '8px', background: labelBg, 
                                        color: labelColor, fontSize: '0.7rem', fontWeight: '900', textAlign: 'center'
                                    }}>
                                        {(opp.matchLabel || 'Match').toUpperCase()}<br/>
                                        {opp.matchPercentage}% MATCH
                                    </div>
                                    <span className="rec-company">{opp.companyName}</span>
                                    <span className="rec-role">{opp.title}</span>
                                    <span className="rec-type">{opp.type?.toUpperCase()}</span>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                        {opp.requiredSkills?.slice(0, 4).map(skill => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                    <div className="rec-footer">
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            Deadline: {new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: '800', borderRadius: '8px' }}
                                            onClick={() => handleApply(opp._id)}
                                        >
                                            APPLY
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ SECTION 7 & 8 · NOTIFICATIONS + UPCOMING DEADLINES ═════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>

                {/* ── Notifications Panel ─────────────────────────────────── */}
                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>NOTIFICATION PANEL</h4>
                        <span onClick={clearAllNotifs} style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}>CLEAR ALL</span>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="section-empty-state" style={{ padding: '2rem' }}>
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 6).map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={`notification-item ${!notif.read ? 'notif-unread' : ''}`} 
                                    onClick={() => markRead(notif.id)} 
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="notification-icon">{notif.icon}</div>
                                    <div className="notification-content">
                                        <p style={{ fontWeight: notif.read ? '500' : '700' }}>{notif.message}</p>
                                        <span className="notif-time">{notif.time}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.6rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px',
                                        background: notif.type === 'URGENT' ? '#fee2e2' : notif.type === 'NEW' ? '#eff6ff' : notif.type === 'SUCCESS' ? '#d1fae5' : '#f1f5f9',
                                        color: notif.type === 'URGENT' ? '#dc2626' : notif.type === 'NEW' ? '#2563eb' : notif.type === 'SUCCESS' ? '#059669' : '#64748b',
                                    }}>{notif.type}</span>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                            <span 
                                onClick={() => navigate('/notifications')} 
                                style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', cursor: 'pointer' }}
                            >
                                VIEW ALL NOTIFICATIONS →
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Upcoming Deadlines ──────────────────────────────────── */}
                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>UPCOMING DEADLINES</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>NEXT 10 DAYS</span>
                    </div>
                    {(() => {
                        const now = new Date();
                        const tenDaysLater = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
                        const upcoming = opportunities
                            .filter(opp => {
                                const d = new Date(opp.deadline);
                                return d >= now && d <= tenDaysLater;
                            })
                            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                        return upcoming.length === 0 ? (
                            <div className="section-empty-state">
                                <div className="empty-icon">📅</div>
                                <p>No upcoming deadlines in the next 10 days.</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>OPPORTUNITY</th>
                                            <th>COMPANY</th>
                                            <th>DEADLINE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcoming.map(opp => (
                                            <tr key={opp._id}>
                                                <td><span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{opp.title}</span></td>
                                                <td><strong style={{ color: 'var(--primary)' }}>{opp.companyName?.toUpperCase()}</strong></td>
                                                <td>
                                                    <span style={{
                                                        fontSize: '0.75rem', fontWeight: '800', padding: '3px 10px', borderRadius: '4px',
                                                        background: '#fee2e2', color: '#dc2626',
                                                    }}>
                                                        {new Date(opp.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ══ SECTION 9 & 10 · QUICK ACTIONS + ACTIVITY TIMELINE ═════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>

                {/* ── Quick Actions Panel ─────────────────────────────────── */}
                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>QUICK ACTIONS</h4>
                    </div>
                    <div className="quick-actions-grid">
                        <button className="btn-outline" onClick={() => navigate('/profile')}>👤 Update Profile</button>
                        <button className="btn-outline" onClick={() => navigate('/profile')}>📄 Upload Resume</button>
                        <button className="btn-outline" onClick={() => navigate('/opportunities')}>💼 Browse Opportunities</button>
                        <button className="btn-outline" onClick={() => navigate('/my-applications')}>📂 View Applications</button>
                    </div>
                </div>

                {/* ── Activity Timeline ───────────────────────────────────── */}
                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>ACTIVITY TIMELINE</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>RECENT</span>
                    </div>
                    <div className="timeline-list">
                        {[
                            { action: 'Applied for Amazon Internship', time: '2 hours ago', icon: '📨' },
                            { action: 'Updated Profile Skills', time: '1 day ago', icon: '🎯' },
                            { action: 'Uploaded Resume', time: '2 days ago', icon: '📄' },
                            { action: 'Application Shortlisted by Infosys', time: '3 days ago', icon: '⭐' },
                            { action: 'Registered on Career Portal', time: '1 week ago', icon: '🏁' },
                        ].map((item, i) => (
                            <div key={i} className="timeline-item">
                                <p className="timeline-action">{item.icon} {item.action}</p>
                                <span className="timeline-time">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ BOTTOM ROW · ACADEMIC CALENDAR + NOTIFICATIONS ═══════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>ACADEMIC CALENDAR</h4>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>VIEW FULL YEAR</a>
                    </div>
                    <div className="linways-event-list">
                        {[
                            { d: '03', m: 'MAR', t: 'World Wildlife Day Celebration', type: 'UPCOMING', c: '#10b981' },
                            { d: '07', m: 'MAR', t: "International Women's Day Forum", type: 'EVENT', c: '#3b82f6' },
                            { d: '10', m: 'MAR', t: 'Internal Assessment Phase - II', type: 'EXAM', c: '#ef4444' },
                            { d: '15', m: 'MAR', t: 'Project Viva-Voce (Final Year)', type: 'ACADEMIC', c: '#7c3aed' },
                        ].map((ev, i) => (
                            <div key={i} className="linways-event-item">
                                <div className="event-date-box">
                                    <div className="event-day">{ev.d}</div>
                                    <div className="event-month">{ev.m}</div>
                                </div>
                                <div className="event-content" style={{ flex: 1 }}>
                                    <h5>{ev.t}</h5>
                                    <span style={{ fontSize: '0.65rem', background: `${ev.c}15`, color: ev.c, padding: '2px 10px', borderRadius: '4px', fontWeight: '800' }}>
                                        {ev.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="linways-card">
                    <div className="linways-card-header">
                        <h4>NOTIFICATIONS & FEEDS</h4>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>MARK ALL READ</a>
                    </div>
                    <div className="linways-message-list">
                        {[
                            { t: 'Campus-wide WiFi Maintenance Schedule', s: 'IT Services', r: 'NEW', time: '1h ago', icon: '📶' },
                            { t: 'New Research Grants and Opportunities 2025', s: 'R&D Dept', r: 'IMPORTANT', time: '4h ago', icon: '🔬' },
                            { t: 'Annual Sports Meet - Volunteers Required', s: 'Sports Office', r: 'NEW', time: 'Yesterday', icon: '⚽' },
                            { t: 'Library Book Return Reminder', s: 'Central Library', r: 'REMINDER', time: '2d ago', icon: '📚' },
                        ].map((m, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.25rem', padding: '1rem 0', borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                    {m.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                                        {m.t}
                                        {m.r === 'IMPORTANT' && (
                                            <span style={{ fontSize: '0.6rem', background: '#f59e0b', color: 'white', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                                                {m.r}
                                            </span>
                                        )}
                                    </h5>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.s} • {m.time}</p>
                                </div>
                                {m.r === 'NEW' && (
                                    <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Apply confirmation modal ──────────────────────────────────── */}
            {applyModal.show && (
                <div
                    className="modal-overlay"
                    style={{ backdropFilter: 'blur(8px)', background: 'rgba(30,27,75,0.4)' }}
                    onClick={() => setApplyModal({ ...applyModal, show: false })}
                >
                    <div
                        className="modal-content"
                        style={{ padding: '3rem 2.5rem', borderRadius: '24px', maxWidth: '450px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                            {applyModal.success ? '📜' : '⚠️'}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--primary)', textAlign: 'center', textTransform: 'uppercase' }}>
                            {applyModal.success ? 'Action Recorded' : 'Process Error'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' }}>
                            {applyModal.message}
                        </p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', fontWeight: '850' }}
                            onClick={() => setApplyModal({ ...applyModal, show: false })}
                        >
                            CONFIRM & CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
