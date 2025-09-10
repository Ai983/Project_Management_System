import { Box, Heading, List, ListItem, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
const MotionBox = motion(Box);

export default function Notifications() {
    const [notifications, setNotifications] = useState<Array<{ channel: string; message: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();
    const [lastSeen, setLastSeen] = useState<Date | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/notifications')
      .then(res => {
        setNotifications(res.data);
        // Show toast for new notifications
        if (lastSeen) {
          const newNotifs = res.data.filter((n: any) => new Date(n.scheduledAt) > lastSeen);
          newNotifs.forEach((n: any) => {
            toast({ title: 'New Notification', description: n.message, status: 'info' });
          });
        }
        if (res.data.length > 0) {
          setLastSeen(new Date(res.data[0].scheduledAt));
        }
      })
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setLoading(false));
    // Mark all as read
    api.patch('/notifications/mark-read');
  }, []); // Only run once on mount

  return (
    <MotionBox
      p={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Heading mb={4}>Notifications</Heading>
      {loading ? <Text>Loading...</Text> : error ? <Text color="red.500">{error}</Text> : (
        <List spacing={3}>
          {notifications.map((n, i) => (
            <ListItem key={i}>
              <Text><strong>{n.channel}:</strong> {n.message}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </MotionBox>
  );
}
