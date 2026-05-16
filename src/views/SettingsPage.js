/**
 * src/views/SettingsPage.js
 *
 * Settings page with six collapsible sections:
 *   Profile, Dashboard, Data, Preferences, CV Detection, Onboarding
 *
 * Requirements: 23.1, 23.2, 24.x, 25.x, 26.x, 27.x, 14.x, 15.x, 6.x, 8.x
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import {
  updateProfile,
  updateEmail,
  deleteUser,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from 'firebaseConfig';
import { useAuth } from 'context/AuthContext';
import { usePrivacy } from 'context/PrivacyContext';
import ExamplesNavbar from 'components/Navbars/ExamplesNavbar.js';
import Footer from 'components/Footer/Footer.js';
import OnboardingModal from 'components/OnboardingModal/OnboardingModal.jsx';
import DifficultySelector from 'components/DifficultySelector/DifficultySelector.jsx';
// ── Shared styles ─────────────────────────────────────────────────────────────

const SS_GREEN = '#00c864';

const glassCard = {
  background:    'rgba(13, 43, 26, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border:        '1px solid rgba(0, 200, 100, 0.15)',
  borderRadius:  '10px',
  boxShadow:     '0 4px 24px rgba(0,0,0,0.4)',
  marginBottom:  '1.25rem',
};

const inputStyle = {
  background:   'rgba(255,255,255,0.06)',
  border:       '1px solid rgba(255,255,255,0.15)',
  borderRadius: '7px',
  color:        '#fff',
  padding:      '0.55rem 0.85rem',
  fontSize:     '0.88rem',
  width:        '100%',
  outline:      'none',
  marginBottom: '0.75rem',
};

const btnPrimary = {
  background:   SS_GREEN,
  color:        '#0d2b1a',
  border:       'none',
  borderRadius: '7px',
  padding:      '0.5rem 1.25rem',
  fontWeight:   700,
  fontSize:     '0.85rem',
  cursor:       'pointer',
};

const btnDanger = {
  background:   'rgba(220,53,69,0.15)',
  color:        '#ff6b6b',
  border:       '1px solid rgba(220,53,69,0.3)',
  borderRadius: '7px',
  padding:      '0.5rem 1.25rem',
  fontWeight:   700,
  fontSize:     '0.85rem',
  cursor:       'pointer',
};

const btnOutline = {
  background:   'transparent',
  color:        'rgba(255,255,255,0.7)',
  border:       '1px solid rgba(255,255,255,0.2)',
  borderRadius: '7px',
  padding:      '0.5rem 1.25rem',
  fontWeight:   600,
  fontSize:     '0.85rem',
  cursor:       'pointer',
};

const labelStyle = {
  fontSize:     '0.78rem',
  opacity:      0.55,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: '0.35rem',
  display:      'block',
};

const sectionHeadingStyle = {
  fontWeight:   700,
  fontSize:     '0.95rem',
  marginBottom: 0,
  display:      'flex',
  alignItems:   'center',
  gap:          '0.6rem',
};

const errorStyle = {
  color:        '#ff6b6b',
  fontSize:     '0.82rem',
  marginBottom: '0.5rem',
};

const successStyle = {
  color:        SS_GREEN,
  fontSize:     '0.82rem',
  marginBottom: '0.5rem',
};

// ── Collapsible section wrapper ───────────────────────────────────────────────

const Section = ({ id, icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} style={{ ...glassCard, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width:      '100%',
          background: 'transparent',
          border:     'none',
          color:      '#fff',
          padding:    '1.1rem 1.5rem',
          cursor:     'pointer',
          display:    'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        aria-expanded={open}
      >
        <span style={sectionHeadingStyle}>
          <i className={icon} style={{ color: SS_GREEN, fontSize: '1rem' }} />
          {title}
        </span>
        <i
          className={`tim-icons ${open ? 'icon-minimal-up' : 'icon-minimal-down'}`}
          style={{ opacity: 0.4, fontSize: '0.8rem' }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ── Divider ───────────────────────────────────────────────────────────────────

const Divider = () => (
  <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1rem 0' }} />
);
// ── Profile Section ───────────────────────────────────────────────────────────
// Requirements: 24.1, 24.2, 24.3, 24.4

const ProfileSection = ({ currentUser }) => {
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail]             = useState(currentUser?.email || '');
  const [nameMsg, setNameMsg]         = useState('');
  const [emailMsg, setEmailMsg]       = useState('');
  const [nameError, setNameError]     = useState('');
  const [emailError, setEmailError]   = useState('');
  const [saving, setSaving]           = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    setNameMsg('');
    setNameError('');
    try {
      await updateProfile(auth.currentUser, { displayName });
      setNameMsg('Display name updated.');
    } catch (err) {
      setNameError('Failed to update display name: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    setSaving(true);
    setEmailMsg('');
    setEmailError('');
    try {
      await updateEmail(auth.currentUser, email);
      setEmailMsg('Email updated.');
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setEmailError(
          'For security, please sign out and sign back in before changing your email.'
        );
      } else {
        setEmailError('Failed to update email: ' + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>
        Update your display name and email address.
      </p>

      <label style={labelStyle}>Display Name</label>
      <input
        style={inputStyle}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Your name"
      />
      {nameError && <p style={errorStyle}>{nameError}</p>}
      {nameMsg   && <p style={successStyle}>{nameMsg}</p>}
      <button style={btnPrimary} onClick={handleSaveName} disabled={saving}>
        Save Name
      </button>

      <Divider />

      <label style={{ ...labelStyle, marginTop: '0.5rem' }}>Email</label>
      <input
        style={inputStyle}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      {emailError && <p style={errorStyle}>{emailError}</p>}
      {emailMsg   && <p style={successStyle}>{emailMsg}</p>}
      <button style={btnPrimary} onClick={handleSaveEmail} disabled={saving}>
        Save Email
      </button>
    </>
  );
};
// ── Dashboard Section ─────────────────────────────────────────────────────────
// Requirements: 8.3, 8.4, 8.5

const WIDGET_LABELS = {
  urgeTracker:       'Urge Tracker',
  insightsChart:     'Insights Chart',
  recentLogs:        'Recent Logs',
  safeStreak:        'Safe Streak',
  dailyInspiration:  'Daily Inspiration',
  recentReflections: 'Recent Reflections',
};

const DEFAULT_WIDGET_PREFS = {
  urgeTracker:       true,
  insightsChart:     true,
  recentLogs:        true,
  safeStreak:        true,
  dailyInspiration:  true,
  recentReflections: true,
};

const DashboardSection = ({ currentUser }) => {
  const [prefs, setPrefs]   = useState(DEFAULT_WIDGET_PREFS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists() && snap.data().widgetPreferences) {
          setPrefs((p) => ({ ...p, ...snap.data().widgetPreferences }));
        }
      } catch (err) {
        console.error('DashboardSection: failed to load prefs', err);
      }
    };
    load();
  }, [currentUser]);

  const handleToggle = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    setMsg('');
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        { widgetPreferences: updated },
        { merge: true }
      );
      setMsg('Saved.');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      console.error('DashboardSection: failed to save prefs', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>
        Choose which widgets appear on your dashboard.
      </p>
      {Object.keys(WIDGET_LABELS).map((key) => (
        <div
          key={key}
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            padding:        '0.55rem 0',
            borderBottom:   '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span style={{ fontSize: '0.88rem' }}>{WIDGET_LABELS[key]}</span>
          <button
            onClick={() => handleToggle(key)}
            disabled={saving}
            aria-pressed={prefs[key]}
            style={{
              background:   prefs[key] ? 'rgba(0,200,100,0.15)' : 'rgba(255,255,255,0.06)',
              border:       prefs[key] ? '1px solid rgba(0,200,100,0.4)' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              color:        prefs[key] ? SS_GREEN : 'rgba(255,255,255,0.4)',
              cursor:       'pointer',
              fontSize:     '0.75rem',
              fontWeight:   700,
              padding:      '0.3rem 0.85rem',
              transition:   'all 0.18s ease',
            }}
          >
            {prefs[key] ? 'On' : 'Off'}
          </button>
        </div>
      ))}
      {msg && <p style={{ ...successStyle, marginTop: '0.75rem' }}>{msg}</p>}
    </>
  );
};
// ── CSV export helper ─────────────────────────────────────────────────────────
// Requirements: 15.1, 15.2, 15.3, 15.4
// Pure functions extracted to utils/csvExport.js for testability
import { generateCSV, triggerCSVDownload } from 'utils/csvExport';
// ── Data Section ──────────────────────────────────────────────────────────────
// Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 15.x, 14.x

const DataSection = ({ currentUser, onDeleteAccount }) => {
  const [logs, setLogs]                   = useState([]);
  const [logsLoading, setLogsLoading]     = useState(true);
  const [deleteTarget, setDeleteTarget]   = useState(null); // log id to confirm delete
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [exportMsg, setExportMsg]         = useState('');
  const [exportError, setExportError]     = useState('');
  const [deleteMsg, setDeleteMsg]         = useState('');
  const [deleteError, setDeleteError]     = useState('');

  const loadLogs = useCallback(async () => {
    if (!currentUser) return;
    setLogsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', currentUser.uid, 'logs'));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => {
        const ta = a.loggedAt?.toDate ? a.loggedAt.toDate() : new Date(a.loggedAt || 0);
        const tb = b.loggedAt?.toDate ? b.loggedAt.toDate() : new Date(b.loggedAt || 0);
        return tb - ta;
      });
      setLogs(items);
    } catch (err) {
      console.error('DataSection: failed to load logs', err);
    } finally {
      setLogsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleDeleteOne = async (logId) => {
    setDeleteMsg('');
    setDeleteError('');
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'logs', logId));
      setDeleteTarget(null);
      setDeleteMsg('Log deleted.');
      setTimeout(() => setDeleteMsg(''), 2500);
      loadLogs();
    } catch (err) {
      setDeleteError('Failed to delete log: ' + err.message);
    }
  };

  const handleDeleteAll = async () => {
    setDeleteMsg('');
    setDeleteError('');
    try {
      const snap = await getDocs(collection(db, 'users', currentUser.uid, 'logs'));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
      setDeleteAllOpen(false);
      setDeleteMsg('All logs deleted.');
      setTimeout(() => setDeleteMsg(''), 2500);
      loadLogs();
    } catch (err) {
      setDeleteError('Failed to delete all logs: ' + err.message);
    }
  };

  const handleExport = async () => {
    setExportMsg('');
    setExportError('');
    try {
      const snap = await getDocs(collection(db, 'users', currentUser.uid, 'logs'));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const csv = generateCSV(items);
      triggerCSVDownload(csv);
      setExportMsg('Download started.');
      setTimeout(() => setExportMsg(''), 3000);
    } catch (err) {
      setExportError('Export failed: ' + err.message);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>
        View and manage your urge logs, export your data, or delete your account.
      </p>

      {/* Export */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button style={btnPrimary} onClick={handleExport}>
          <i className="tim-icons icon-cloud-download-93" style={{ marginRight: 6 }} />
          Download my data (CSV)
        </button>
        {exportMsg   && <p style={{ ...successStyle, marginTop: '0.5rem' }}>{exportMsg}</p>}
        {exportError && <p style={{ ...errorStyle,   marginTop: '0.5rem' }}>{exportError}</p>}
      </div>

      <Divider />

      {/* Log list */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>
          Your Urge Logs ({logs.length})
        </p>
        {logsLoading && (
          <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>Loading…</p>
        )}
        {!logsLoading && logs.length === 0 && (
          <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>No logs yet.</p>
        )}
        {!logsLoading && logs.length > 0 && (
          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'flex-start',
                  padding:        '0.55rem 0',
                  borderBottom:   '1px solid rgba(255,255,255,0.05)',
                  gap:            '0.75rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', opacity: 0.7 }}>{formatDate(log.loggedAt)}</span>
                  {log.intensity != null && (
                    <span style={{ fontSize: '0.78rem', color: SS_GREEN, marginLeft: '0.5rem' }}>
                      Intensity: {log.intensity}
                    </span>
                  )}
                  {log.note && (
                    <p style={{ fontSize: '0.78rem', opacity: 0.45, fontStyle: 'italic', marginBottom: 0, marginTop: '0.1rem' }}>
                      {log.note}
                    </p>
                  )}
                </div>
                {deleteTarget === log.id ? (
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button
                      style={{ ...btnDanger, padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                      onClick={() => handleDeleteOne(log.id)}
                    >
                      Confirm
                    </button>
                    <button
                      style={{ ...btnOutline, padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                      onClick={() => setDeleteTarget(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    style={{ ...btnOutline, padding: '0.3rem 0.7rem', fontSize: '0.75rem', flexShrink: 0 }}
                    onClick={() => setDeleteTarget(log.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {deleteMsg   && <p style={{ ...successStyle, marginTop: '0.5rem' }}>{deleteMsg}</p>}
        {deleteError && <p style={{ ...errorStyle,   marginTop: '0.5rem' }}>{deleteError}</p>}
      </div>

      <Divider />

      {/* Delete all logs */}
      <div style={{ marginBottom: '1.25rem' }}>
        {!deleteAllOpen ? (
          <button style={btnDanger} onClick={() => setDeleteAllOpen(true)}>
            Delete all logs
          </button>
        ) : (
          <div style={{
            background:   'rgba(220,53,69,0.08)',
            border:       '1px solid rgba(220,53,69,0.25)',
            borderRadius: '8px',
            padding:      '1rem',
          }}>
            <p style={{ fontSize: '0.88rem', marginBottom: '0.75rem' }}>
              This will permanently delete all your urge logs. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button style={btnDanger} onClick={handleDeleteAll}>
                Yes, delete all
              </button>
              <button style={btnOutline} onClick={() => setDeleteAllOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Divider />

      {/* Account deletion link */}
      <div>
        <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.6rem' }}>
          Need to remove everything?
        </p>
        <button style={btnDanger} onClick={onDeleteAccount}>
          Delete my account and all data
        </button>
      </div>
    </>
  );
};
// ── Account Deletion Modal ────────────────────────────────────────────────────
// Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6

const AccountDeletionModal = ({ onClose, onDeleted }) => {
  const [step, setStep]           = useState(1); // 1 = first confirm, 2 = type DELETE
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting]   = useState(false);
  const [error, setError]         = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    setError('');
    const user = auth.currentUser;
    if (!user) { setError('No authenticated user found.'); setDeleting(false); return; }

    try {
      // Step 1: delete all logs
      const logsSnap = await getDocs(collection(db, 'users', user.uid, 'logs'));
      await Promise.all(logsSnap.docs.map((d) => deleteDoc(d.ref)));

      // Step 2: delete user document
      await deleteDoc(doc(db, 'users', user.uid));

      // Step 3: delete Firebase Auth account
      await deleteUser(user);

      // Step 4: sign out and navigate
      await signOut(auth);
      onDeleted();
    } catch (err) {
      // On any failure, leave account intact and show error
      if (err.code === 'auth/requires-recent-login') {
        setError(
          'For security, please sign out and sign back in before deleting your account.'
        );
      } else {
        setError('Deletion failed: ' + err.message + '. Your account has not been deleted.');
      }
      setDeleting(false);
    }
  };

  const overlayStyle = {
    position:       'fixed',
    inset:          0,
    background:     'rgba(0,0,0,0.75)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         9999,
    padding:        '1rem',
  };

  const modalStyle = {
    background:   '#0d2b1a',
    border:       '1px solid rgba(220,53,69,0.3)',
    borderRadius: '12px',
    boxShadow:    '0 8px 40px rgba(0,0,0,0.6)',
    maxWidth:     '460px',
    width:        '100%',
    padding:      '2rem',
    color:        '#fff',
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        {step === 1 && (
          <>
            <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', color: '#ff6b6b' }}>
              Delete account
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              This will permanently delete your account and all data, including all urge logs
              and preferences. <strong>This cannot be undone.</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button style={btnOutline} onClick={onClose}>Cancel</button>
              <button style={btnDanger} onClick={() => setStep(2)}>Continue</button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', color: '#ff6b6b' }}>
              Are you sure?
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Type <strong>DELETE</strong> to confirm permanent account deletion.
            </p>
            <input
              style={{ ...inputStyle, marginBottom: '1rem' }}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              autoFocus
            />
            {error && <p style={{ ...errorStyle, marginBottom: '0.75rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button style={btnOutline} onClick={onClose} disabled={deleting}>Cancel</button>
              <button
                style={{
                  ...btnDanger,
                  opacity: confirmText !== 'DELETE' || deleting ? 0.5 : 1,
                  cursor:  confirmText !== 'DELETE' || deleting ? 'not-allowed' : 'pointer',
                }}
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || deleting}
              >
                {deleting ? 'Deleting…' : 'Delete my account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
// ── Preferences Section ───────────────────────────────────────────────────────
// Requirements: 26.1, 26.2, 26.3, 26.4

const PreferencesSection = ({ currentUser }) => {
  const [difficulty, setDifficulty]       = useState('intermediate');
  const [suppression, setSuppression]     = useState(5);
  const [saving, setSaving]               = useState(false);
  const [msg, setMsg]                     = useState('');
  const [error, setError]                 = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const prefs = snap.data().preferences || {};
          if (prefs.defaultGroundingDifficulty) setDifficulty(prefs.defaultGroundingDifficulty);
          if (prefs.alertSuppressionMinutes != null) setSuppression(prefs.alertSuppressionMinutes);
        }
      } catch (err) {
        console.error('PreferencesSection: failed to load', err);
      }
    };
    load();
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    setError('');
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          preferences: {
            defaultGroundingDifficulty: difficulty,
            alertSuppressionMinutes:    suppression,
          },
        },
        { merge: true }
      );
      setMsg('Preferences saved.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError('Failed to save preferences: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>
        Set your default grounding difficulty and alert suppression duration.
      </p>

      <label style={labelStyle}>Default Grounding Difficulty</label>
      <DifficultySelector
        value={difficulty}
        onChange={(v) => setDifficulty(v)}
      />

      <Divider />

      <label style={labelStyle}>Alert Suppression Duration</label>
      <p style={{ fontSize: '0.82rem', opacity: 0.55, marginBottom: '0.6rem' }}>
        After dismissing a CV alert, wait this many minutes before showing another.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <input
          type="range"
          min={1}
          max={60}
          value={suppression}
          onChange={(e) => setSuppression(Number(e.target.value))}
          style={{ flex: 1, accentColor: SS_GREEN }}
        />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: SS_GREEN, minWidth: '3rem' }}>
          {suppression} min
        </span>
      </div>

      {error && <p style={errorStyle}>{error}</p>}
      {msg   && <p style={successStyle}>{msg}</p>}

      <button style={btnPrimary} onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Preferences'}
      </button>
    </>
  );
};
// ── CV Detection Section ──────────────────────────────────────────────────────
// Requirements: 27.1, 27.2, 27.3, 27.4, 27.5

const CVDetectionSection = () => {
  const { cvEnabled, setCvEnabled } = usePrivacy();
  const [sensitivity, setSensitivity] = useState(3.0);
  const [saveMsg, setSaveMsg]         = useState('');
  const [saveError, setSaveError]     = useState('');

  // Load current distance_threshold from backend/config.json via fetch
  useEffect(() => {
    fetch('/backend/config.json')
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.distance_threshold != null) setSensitivity(cfg.distance_threshold);
      })
      .catch(() => {
        // Backend config not accessible from browser — use default
      });
  }, []);

  const handleSaveSensitivity = async () => {
    setSaveMsg('');
    setSaveError('');
    try {
      // Write to backend/config.json via a local API endpoint if available,
      // otherwise inform the user to update manually.
      // Since the backend is a local FastAPI server, we attempt a PATCH/POST.
      const res = await fetch('http://localhost:8000/config', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ distance_threshold: sensitivity }),
      });
      if (res.ok) {
        setSaveMsg('Sensitivity saved to backend config.');
      } else {
        setSaveError('Backend returned an error. Update backend/config.json manually.');
      }
    } catch {
      setSaveError(
        'Could not reach the local backend. To apply this change, update ' +
        '"distance_threshold" in backend/config.json manually.'
      );
    }
    setTimeout(() => { setSaveMsg(''); setSaveError(''); }, 5000);
  };

  return (
    <>
      <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>
        Control real-time hand-to-face proximity detection.
      </p>

      {/* Enable / disable toggle */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   '1.25rem',
      }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
            CV Detection
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: 0 }}>
            Enable real-time proximity alerts
          </p>
        </div>
        <button
          onClick={() => setCvEnabled(!cvEnabled)}
          aria-pressed={cvEnabled}
          style={{
            background:   cvEnabled ? 'rgba(0,200,100,0.15)' : 'rgba(255,255,255,0.06)',
            border:       cvEnabled ? '1px solid rgba(0,200,100,0.4)' : '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            color:        cvEnabled ? SS_GREEN : 'rgba(255,255,255,0.4)',
            cursor:       'pointer',
            fontSize:     '0.8rem',
            fontWeight:   700,
            padding:      '0.4rem 1rem',
            transition:   'all 0.18s ease',
          }}
        >
          {cvEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <Divider />

      {/* Sensitivity slider */}
      <label style={labelStyle}>Detection Sensitivity</label>
      <p style={{ fontSize: '0.82rem', opacity: 0.55, marginBottom: '0.6rem' }}>
        Controls <code>distance_threshold</code> in the backend config. Lower values
        trigger alerts only when your hand is very close; higher values trigger earlier.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Close</span>
        <input
          type="range"
          min={0.5}
          max={8.0}
          step={0.1}
          value={sensitivity}
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: SS_GREEN }}
        />
        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Far</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: SS_GREEN, minWidth: '2.5rem' }}>
          {sensitivity.toFixed(1)}
        </span>
      </div>
      <button style={{ ...btnPrimary, marginBottom: '0.5rem' }} onClick={handleSaveSensitivity}>
        Save Sensitivity
      </button>
      {saveMsg   && <p style={{ ...successStyle, marginTop: '0.5rem' }}>{saveMsg}</p>}
      {saveError && <p style={{ ...errorStyle,   marginTop: '0.5rem' }}>{saveError}</p>}

      <Divider />

      {/* Privacy link */}
      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        <Link to="/privacy" style={{ color: SS_GREEN }}>
          Read our full privacy policy →
        </Link>
      </p>

      {/* Local-only note */}
      <p style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: 0 }}>
        <i className="tim-icons icon-lock-circle" style={{ marginRight: 5 }} />
        <code>detections.log</code> is stored locally on your device only and is never
        transmitted to any server.
      </p>
    </>
  );
};
// ── Onboarding Section ────────────────────────────────────────────────────────
// Requirements: 6.1, 6.2

const OnboardingSection = ({ onRevisit }) => (
  <>
    <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>
      Review the onboarding flow at any time — including privacy information and
      CV detection setup instructions.
    </p>
    <button style={btnPrimary} onClick={onRevisit}>
      <i className="tim-icons icon-refresh-02" style={{ marginRight: 6 }} />
      Revisit onboarding
    </button>
  </>
);

// ── SettingsPage ──────────────────────────────────────────────────────────────
// Requirements: 23.1, 23.2

const SettingsPage = () => {
  const { currentUser }                   = useAuth();
  const navigate                          = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleted = () => {
    navigate('/');
  };

  return (
    <>
      <ExamplesNavbar />

      <div style={{
        minHeight:    '100vh',
        background:   '#0d2b1a',
        paddingTop:   '80px',
        paddingBottom: '4rem',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position:      'fixed',
          inset:         0,
          background:    'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,200,100,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex:        0,
        }} />

        <Container style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>

          {/* Page header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '0.3rem' }}>Settings</h2>
            <p style={{ fontSize: '0.88rem', opacity: 0.5, marginBottom: 0 }}>
              Manage your profile, preferences, and data.
            </p>
          </div>

          {/* ── Profile ── */}
          <Section id="profile" icon="tim-icons icon-single-02" title="Profile" defaultOpen>
            <ProfileSection currentUser={currentUser} />
          </Section>

          {/* ── Dashboard ── */}
          <Section id="dashboard" icon="tim-icons icon-chart-bar-32" title="Dashboard">
            <DashboardSection currentUser={currentUser} />
          </Section>

          {/* ── Data ── */}
          <Section id="data" icon="tim-icons icon-notes" title="Data">
            <DataSection
              currentUser={currentUser}
              onDeleteAccount={() => setShowDeleteModal(true)}
            />
          </Section>

          {/* ── Preferences ── */}
          <Section id="preferences" icon="tim-icons icon-settings-gear-63" title="Preferences">
            <PreferencesSection currentUser={currentUser} />
          </Section>

          {/* ── CV Detection ── */}
          <Section id="cv-detection" icon="tim-icons icon-camera-18" title="CV Detection">
            <CVDetectionSection />
          </Section>

          {/* ── Onboarding ── */}
          <Section id="onboarding" icon="tim-icons icon-spaceship" title="Onboarding">
            <OnboardingSection onRevisit={() => setShowOnboarding(true)} />
          </Section>

        </Container>
      </div>

      <Footer />

      {/* Onboarding modal — revisit from Screen 1 */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onDismiss={() => setShowOnboarding(false)}
      />

      {/* Account deletion modal */}
      {showDeleteModal && (
        <AccountDeletionModal
          onClose={() => setShowDeleteModal(false)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
};

export default SettingsPage;