import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Detect if user is inside placement or internship portal based on URL
    const isPlacementPortal = location.pathname.startsWith('/placement');
    const isInternshipPortal = location.pathname.startsWith('/internship');

    // Portal-aware student menus
    const studentDefaultMenu = [
        { path: '/', label: 'Portal Select', icon: '🏠' },
        { path: '/placement', label: 'Placements', icon: '💼' },
        { path: '/internship', label: 'Internships', icon: '🎓' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
    ];

    const studentPlacementMenu = [
        { path: '/', label: 'Portal Select', icon: '🏠' },
        { path: '/placement', label: 'Dashboard', icon: '📊' },
        { path: '/opportunities', label: 'Opportunities', icon: '💼' },
        { path: '/my-applications', label: 'Applications', icon: '📂' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
    ];

    const studentInternshipMenu = [
        { path: '/', label: 'Portal Select', icon: '🏠' },
        { path: '/internship', label: 'Dashboard', icon: '📊' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
    ];

    const menuItems = {
        student: isPlacementPortal
            ? studentPlacementMenu
            : isInternshipPortal
                ? studentInternshipMenu
                : studentDefaultMenu,
        recruiter: [
            { path: '/', label: 'Overview', icon: '📊' },
            { path: '/opportunities', label: 'Offerings', icon: '📄' },
            { path: '/create-opportunity', label: 'Draft Posting', icon: '➕' },
            { path: '/notifications', label: 'Alerts', icon: '🔔' },
        ],
        admin: [
            { path: '/', label: 'Institute Stats', icon: '📊' },
            { path: '/analytics', label: 'Analytics Hub', icon: '📈' },
            { path: '/opportunities', label: 'All Postings', icon: '📋' },
            { path: '/create-opportunity', label: 'New Listing', icon: '🆕' },
            { path: '/notifications', label: 'Alert Center', icon: '🔔' },
        ],
        faculty: [
            { path: '/', label: 'Professional Hub', icon: '🎓' },
            { path: '/academic-profile', label: 'My Credentials', icon: '👤' },
            { path: '/opportunities', label: 'Engagement Center', icon: '🏢' },
            { path: '/notifications', label: 'Institutional Alerts', icon: '🔔' },
        ],
        coordinator: [
            { path: '/', label: 'Coordination Hub', icon: '🎓' },
            { path: '/analytics', label: 'Dept Analytics', icon: '📈' },
            { path: '/academic-profile', label: 'Portal Profile', icon: '👤' },
            { path: '/opportunities', label: 'Workflow Management', icon: '🏢' },
            { path: '/notifications', label: 'System Alerts', icon: '🔔' },
        ],
        hod: [
            { path: '/', label: 'Departmental Hub', icon: '🎓' },
            { path: '/analytics', label: 'Analytics Insights', icon: '📈' },
            { path: '/academic-profile', label: 'HOD Profile', icon: '👤' },
            { path: '/opportunities', label: 'Approval Gateway', icon: '🏢' },
            { path: '/notifications', label: 'Admin Alerts', icon: '🔔' },
        ],
        dean: [
            { path: '/', label: 'Executive Hub', icon: '🎓' },
            { path: '/analytics', label: 'Institutional Trends', icon: '📈' },
            { path: '/academic-profile', label: 'Executive Profile', icon: '👤' },
            { path: '/opportunities', label: 'Final Approvals', icon: '🏢' },
            { path: '/notifications', label: 'Executive Alerts', icon: '🔔' },
        ]
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currentMenu = menuItems[user?.role] || [];

    // Determine portal indicator for sidebar header
    const portalLabel = isPlacementPortal
        ? 'Placement'
        : isInternshipPortal
            ? 'Internship'
            : null;

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo-icon">🏛️</div>
                <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '850', letterSpacing: '0.05em' }}>MAIN NAVIGATOR</h3>
                    {portalLabel && (
                        <span style={{
                            fontSize: '0.6rem',
                            fontWeight: '900',
                            letterSpacing: '1px',
                            color: 'var(--primary)',
                            background: 'white',
                            padding: '2px 8px',
                            borderRadius: '2px',
                            textTransform: 'uppercase',
                            marginTop: '4px',
                            display: 'inline-block'
                        }}>
                            {portalLabel} SECTOR
                        </span>
                    )}
                </div>
            </div>

            <nav className="sidebar-menu">
                <ul>
                    {currentMenu.map((item) => (
                        <li key={item.path + item.label}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => isActive ? 'active' : ''}
                                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
                                end={item.path === '/'}
                            >
                                <span className="menu-icon" style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                                <span className="menu-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn-sidebar">
                    <span className="menu-icon" style={{ fontSize: '1.2rem' }}>🔌</span>
                    <span className="menu-text">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
