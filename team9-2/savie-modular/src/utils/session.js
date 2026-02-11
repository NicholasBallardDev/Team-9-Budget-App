export const getSessionId = () => {
  let sessionId = localStorage.getItem('savie_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('savie_session_id', sessionId);
  }
  return sessionId;
};

export const clearSession = () => {
  localStorage.removeItem('savie_session_id');
};
