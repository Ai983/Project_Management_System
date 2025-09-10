// src/pages/dashboard.tsx
import {
  Box, SimpleGrid, Stat, StatLabel, StatNumber,
  Heading, Spinner, useToast, Flex, Text, VStack, Link, Badge
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Define interfaces for our data shapes
interface Task {
  id: string;
  status: string;
  plannedEnd: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalProjects: number;
  activeProjects: number;
}

const StatCard = ({ label, value }: { label: string, value: number }) => (
  <Stat
    p={5}
    shadow="md"
    borderWidth="1px"
    borderRadius="lg"
    bg="white"
    _dark={{ bg: 'gray.700' }}
  >
    <StatLabel fontWeight="medium" isTruncated color="gray.500" _dark={{ color: 'gray.400' }}>
      {label}
    </StatLabel>
    <StatNumber fontSize="2xl" fontWeight="bold">
      {value}
    </StatNumber>
  </Stat>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      // Fetch both projects and tasks concurrently
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);

      const projects: Project[] = projectsRes.data;
      const tasks: Task[] = tasksRes.data;

      // Calculate stats
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status !== 'Completed').length;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Done').length;
      const overdueTasks = tasks.filter(t => t.status !== 'Done' && new Date(t.plannedEnd) < new Date()).length;

      setStats({ totalProjects, activeProjects, totalTasks, completedTasks, overdueTasks });
      
      // Get the 5 most recent projects
      setRecentProjects(projects.slice(-5).reverse());

    } catch (err) {
      toast({ title: 'Failed to load dashboard data', status: 'error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <MotionBox
      p={8}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
      minH="100vh"
    >
      <Heading mb={6}>Project Dashboard</Heading>
      {loading ? (
        <Flex justify="center" align="center" h="50vh"><Spinner size="xl" /></Flex>
      ) : (
        <VStack spacing={8} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={6}>
            <StatCard label="Total Projects" value={stats?.totalProjects ?? 0} />
            <StatCard label="Active Projects" value={stats?.activeProjects ?? 0} />
            <StatCard label="Total Tasks" value={stats?.totalTasks ?? 0} />
            <StatCard label="Completed Tasks" value={stats?.completedTasks ?? 0} />
            <StatCard label="Overdue Tasks" value={stats?.overdueTasks ?? 0} />
          </SimpleGrid>

          <Box>
            <Heading size="lg" mb={4}>Recent Projects</Heading>
            <VStack spacing={4} align="stretch">
              {recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <Flex
                    key={project.id}
                    p={4}
                    shadow="sm"
                    borderWidth="1px"
                    borderRadius="md"
                    justify="space-between"
                    align="center"
                    bg="white"
                    _dark={{ bg: 'gray.800' }}
                  >
                    <Text fontWeight="bold">{project.name}</Text>
                    <Badge colorScheme={project.status === 'Completed' ? 'green' : 'purple'}>
                      {project.status || 'In Progress'}
                    </Badge>
                    <Link as={RouterLink} to={`/projects/${project.id}`} color="purple.500" fontWeight="bold">
                      View
                    </Link>
                  </Flex>
                ))
              ) : (
                <Text color="gray.500">No recent projects to display.</Text>
              )}
            </VStack>
          </Box>
        </VStack>
      )}
    </MotionBox>
  );
};

export default Dashboard;
