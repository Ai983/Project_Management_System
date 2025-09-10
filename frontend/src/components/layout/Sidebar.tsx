import { VStack, Box, Link, Text, HStack, Circle, useToast } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { io } from 'socket.io-client';


export default function Sidebar() {
  const [role, setRole] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    // Fetch user info and unread count on mount
    const fetchUserAndUnread = async () => {
      try {
        const meRes = await api.get('/auth/me');
        const user = meRes.data;
        setRole(user.roles ? user.roles[0] : user.role || '');
        // Fetch unread count
        const unreadRes = await api.get('/notifications/unread-count');
        setUnreadCount(unreadRes.data);
        // Connect to WebSocket and join room
        const s = io('http://localhost:3000');
        if (user.userId || user.id || user._id) {
          s.emit('join', user.userId || user.id || user._id);
        }
        s.on('notification', (notif: any) => {
          setUnreadCount((c: number) => c + 1);
          toast({ title: 'New Notification', description: notif.message, status: 'info' });
        });
        // Clean up
        return () => { s.disconnect(); };
      } catch (err) {
        setRole('');
        setUnreadCount(0);
      }
    };
    fetchUserAndUnread();
    // eslint-disable-next-line
  }, []);

  return (
    <Box bg="gray.100" w="200px" p={4} h="100vh" position="fixed">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" mb={4}>Hagerstone</Text>
        <Link as={NavLink} to="/dashboard">Dashboard</Link>
        <Link as={NavLink} to="/projects">Projects</Link>
        <Link as={NavLink} to="/tasks">Tasks</Link>
        <Link as={NavLink} to="/kanban">Kanban Board</Link>
        <HStack>
          <Link as={NavLink} to="/notifications">Notifications</Link>
          {unreadCount > 0 && (
            <Circle size="18px" bg="red.400" color="white" fontSize="xs" fontWeight="bold">
              {unreadCount}
            </Circle>
          )}
        </HStack>
        {role === 'Director' && <Link as={NavLink} to="/admin">Admin Panel</Link>}
        <Link as={NavLink} to="/" onClick={() => localStorage.removeItem('token')}>
          Logout
        </Link>
      </VStack>
    </Box>
  );
}
