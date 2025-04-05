import { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function SessionSecurityWrapper({ children }) {
  const [terminated, setTerminated] = useState(false);
  const [warningModal, setWarningModal] = useState({ show: false, title: '', message: '', severity: 'warning' });
  const [remainingWarnings, setRemainingWarnings] = useState(3);
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const INACTIVITY_LIMIT = 300; // in seconds

  const handleUnsavedDataWarning = e => {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnsavedDataWarning);
    return () => window.removeEventListener('beforeunload', handleUnsavedDataWarning);
  }, []);

  const showWarning = (title, message, severity = 'warning') => {
    setWarningModal({ show: true, title, message, severity });
  };

  const handleAcknowledge = () => {
    setRemainingWarnings(prev => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        localStorage.setItem('sessionTerminated', 'true');
        setTerminated(true);
      }
      return newCount;
    });
    setWarningModal(prev => ({ ...prev, show: false }));
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    const timer = setTimeout(() => {
      showWarning('Inactivity Warning', `You will be logged out due to inactivity. (${remainingWarnings} warnings left)`, 'error');
    }, (INACTIVITY_LIMIT - 60) * 1000);
    setInactivityTimer(timer);
  };

  useEffect(() => {
    const sessionTerminatedFlag = localStorage.getItem('sessionTerminated');
    if (sessionTerminatedFlag === 'true') {
      setTerminated(true);
      return;
    }

    if (terminated) {
      document.body.style.pointerEvents = 'none';
      document.body.style.userSelect = 'none';
      return;
    }

    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = 'Leaving will terminate your session.';
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        showWarning('Tab Switch Detected', `Stay on this tab. (${remainingWarnings} warnings left)`, 'error');
      }
    };

    const handleFocus = () => resetInactivityTimer();
    const handleBlur = () => {
      showWarning('Window Not Focused', `You switched apps. (${remainingWarnings} warnings left)`, 'error');
    };

    const handleStorageEvent = e => {
      if (e.key === 'tabActivity') {
        showWarning('Multiple Tabs Detected', `Use only one tab. (${remainingWarnings} warnings left)`, 'error');
      }
      if (e.key === 'sessionTerminated' && e.newValue === 'true') {
        setTerminated(true);
      }
    };

    const handleOffline = () => {
      showWarning('Offline', `You lost connection. (${remainingWarnings} warnings left)`, 'error');
    };

    const handleCopyPaste = e => e.preventDefault();
    const handleActivity = () => resetInactivityTimer();

    localStorage.setItem('tabActivity', Date.now());
    window.addEventListener('storage', handleStorageEvent);

    resetInactivityTimer();
    handleFocus();

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(e =>
      window.addEventListener(e, handleActivity)
    );

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      window.removeEventListener('storage', handleStorageEvent);
      ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(e =>
        window.removeEventListener(e, handleActivity)
      );
      clearTimeout(inactivityTimer);
    };
  }, [terminated, remainingWarnings]);

  if (terminated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        color: 'white',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#d32f2f',
          padding: '40px',
          borderRadius: '10px',
          maxWidth: '600px'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>SESSION TERMINATED</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Your session was terminated due to multiple security violations.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('sessionTerminated');
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#d32f2f',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
            CLOSE AND RESTART
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Modal
        isOpen={warningModal.show}
        onRequestClose={handleAcknowledge}
        contentLabel="Warning"
        style={{
          overlay: { backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000 },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
            padding: '20px 24px',
            maxWidth: '400px',
          }
        }}>
        <h2 style={{
          color: warningModal.severity === 'error' ? '#d32f2f' : '#f57c00',
          fontSize: '1.25rem',
          marginBottom: '10px'
        }}>{warningModal.title}</h2>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.4', marginBottom: '16px' }}>
          {warningModal.message}
        </p>
        <button
          onClick={handleAcknowledge}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Acknowledge
        </button>
      </Modal>
    </>
  );
}