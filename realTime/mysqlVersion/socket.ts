import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native'; 

const SERVER_URL = Platform.OS === 'web' ? 'http://localhost:3001' : 'http://10.0.2.2:3001';

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SERVER_URL, {
      transports: ['websocket'],
    });
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const fetchTasks = () => {
    socket?.emit('fetchTasks');
  };

  const addTask = (task: any) => {
    socket?.emit('addTask', task);
  };

  const toggleTask = (task: any) => {
    socket?.emit('toggleTask', task);
  };

  const deleteTask = (taskId: string) => {
    socket?.emit('deleteTask', taskId);
  };

  const onTaskFetched = (callback: (task: any) => void) => {
    socket?.off('tasksFetched', callback); // Remove the specific listener
    socket?.on('tasksFetched', callback);  // Add the new listener
  };
  

  const onTaskAdded = (callback: (task: any) => void) => {
    socket?.off('taskAdded'); // Avoid duplicate listeners
    socket?.on('taskAdded', callback);
  };

  const onTaskToggled = (callback: (task: any) => void) => {
    socket?.off('taskToggled');
    socket?.on('taskToggled', callback);
  };

  const onTaskDeleted = (callback: (taskId: string) => void) => {
    socket?.off('taskDeleted');
    socket?.on('taskDeleted', callback);
  };

  const onError = (callback: (error: string) => void) => {
    socket?.off('error');
    socket?.on('error', callback);
  };

  return {
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    onTaskFetched,
    onTaskAdded,
    onTaskToggled,
    onTaskDeleted,
    onError,
  };
};

export default useSocket;
