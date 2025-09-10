import { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Heading, Stack, Text, Progress, Badge, Avatar, Flex, Select } from '@chakra-ui/react';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    api.get('/tasks').then(res => setTasks(res.data));
  }, []);

  const filteredTasks = tasks
    .filter(task => !filterStatus || task.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'start') return a.plannedStart.localeCompare(b.plannedStart);
      if (sortBy === 'end') return a.plannedEnd.localeCompare(b.plannedEnd);
      if (sortBy === 'progress') return b.percentComplete - a.percentComplete;
      return 0;
    });

  return (
    <Box minH="100vh" p={8}>
      <Heading mb={6}>My Tasks</Heading>
      <Stack spacing={6}>
        <Box mb={4} display="flex" gap={4} alignItems="center">
          <Select placeholder="Filter by status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} width="200px">
            <option value="Not Started">Not Started</option>
            <option value="Started">Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          <Select placeholder="Sort by" value={sortBy} onChange={e => setSortBy(e.target.value)} width="200px">
            <option value="start">Start Date</option>
            <option value="end">End Date</option>
            <option value="progress">Progress</option>
          </Select>
        </Box>
        {filteredTasks.length === 0 ? (
          <Text color="gray.500">No tasks assigned to you.</Text>
        ) : (
          filteredTasks.map(task => (
            <Box key={task.id} p={6} bg="white" boxShadow="md" borderRadius="md">
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold" fontSize="lg">{task.title}</Text>
                  {task.project && (
                    <Text fontSize="md" color="gray.700">Project: {task.project.name}</Text>
                  )}
                  {task.description && (
                    <Text fontSize="sm" color="gray.600">{task.description}</Text>
                  )}
                  <Badge colorScheme={task.status === 'Completed' ? 'green' : 'purple'}>
                    {task.status}
                  </Badge>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {task.plannedStart} - {task.plannedEnd}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Assignee: <Avatar size="xs" name={task.assignee?.name} mr={2} /> {task.assignee?.name || 'Unassigned'}
                  </Text>
                </Box>
                <Box minW="180px">
                  <Text fontSize="sm" color="gray.600" mb={1}>Progress</Text>
                  <Progress value={task.percentComplete} size="sm" colorScheme="purple" />
                  <Text fontSize="xs" color="gray.500" mt={1}>{task.percentComplete}%</Text>
                </Box>
              </Flex>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}
