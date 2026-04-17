import { useCallback, useState } from 'react';
import { apiFetch } from '../lib/api';

const initState = { data: null, loading: false, error: null };

// Alias so all existing call sites inside this file need no further changes.
const request = apiFetch;

export function useAgent() {
  const [recommendations, setRecommendations] = useState(initState);
  const [chat, setChat] = useState(initState);
  const [riskStudents, setRiskStudents] = useState(initState);
  const [agentRun, setAgentRun] = useState(initState);
  const [alerts, setAlerts] = useState(initState);
  const [applications, setApplications] = useState(initState);

  const fetchRecommendations = useCallback(async (userId) => {
    setRecommendations({ data: null, loading: true, error: null });
    try {
      const data = await request(`/api/recommendations?userId=${userId}`);
      setRecommendations({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setRecommendations({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  const fetchAlerts = useCallback(async (userId) => {
    setAlerts({ data: null, loading: true, error: null });
    try {
      const data = await request(`/api/alerts?userId=${userId}`);
      setAlerts({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setAlerts({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  const fetchApplications = useCallback(async (userId) => {
    setApplications({ data: null, loading: true, error: null });
    try {
      const data = await request(`/api/applications?userId=${userId}`);
      setApplications({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setApplications({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  const sendChatMessage = useCallback(async (message, history, userId = null) => {
    setChat({ data: null, loading: true, error: null });
    try {
      const data = await request('/api/agent/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history, userId }),
      });
      setChat({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setChat({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  const fetchRiskStudents = useCallback(async () => {
    setRiskStudents({ data: null, loading: true, error: null });
    try {
      const data = await request('/api/admin/risk-students');
      setRiskStudents({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setRiskStudents({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  const triggerAgentRun = useCallback(async (studentId) => {
    setAgentRun({ data: null, loading: true, error: null });
    try {
      const data = await request('/api/agent/run', { method: 'POST', body: JSON.stringify({ studentId }) });
      setAgentRun({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setAgentRun({ data: null, loading: false, error });
      throw error;
    }
  }, []);

  return {
    recommendations, chat, riskStudents, agentRun, alerts, applications,
    fetchRecommendations, sendChatMessage, fetchRiskStudents, triggerAgentRun,
    fetchAlerts, fetchApplications,
  };
}

