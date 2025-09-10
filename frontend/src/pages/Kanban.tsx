import React from 'react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { Box } from '@chakra-ui/react';

export default function Kanban() {
  return (
    <Box minH="100vh" bg="gray.100" p={4}>
      <KanbanBoard />
    </Box>
  );
} 