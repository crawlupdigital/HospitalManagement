import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useDashboardStore from '../store/dashboardStore';

const useSocket = () => {
  const socketRef = useRef(null);
  const { setStats, setPatientFlow, setConnected } = useDashboardStore();

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    socketRef.current = io(url, {
      auth: { token: localStorage.getItem('auth_token') },
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // Real-time dashboard updates
    socketRef.current.on('stats:update', (data) => setStats(data));
    socketRef.current.on('patient-flow:update', (data) => setPatientFlow(data));

    // Specific events that trigger refetches (handled by individual pages)
    socketRef.current.on('appointment:new', () => {});
    socketRef.current.on('appointment:status-change', () => {});
    socketRef.current.on('invoice:paid', () => {});
    socketRef.current.on('bed:status-change', () => {});

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
