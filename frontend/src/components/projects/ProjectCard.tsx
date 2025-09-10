import { Box, Heading, Text, Badge, Button, AvatarGroup, Avatar, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// Define types for the props
type ProjectCardProps = {
  project: {
    id: string | number;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    employees?: { id: string; email: string; }[];
  };
  onEdit?: (project: any) => void;
};

const statusColor: { [key: string]: string } = {
  "In Progress": "purple",
  "Completed": "green",
  "Not Started": "orange",
};

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const navigate = useNavigate();
  return (
    <Box bg="white" boxShadow="md" rounded="lg" p={6} mb={4} borderLeft={`8px solid #805ad5`}>
      <Stack direction="row" align="center" justify="space-between">
        <Heading size="md">{project.name}</Heading>
        <Badge colorScheme={statusColor[project.status] || "gray"}>
          {project.status}
        </Badge>
      </Stack>
      <Text mt={2} color="gray.600">{project.description}</Text>
      <Stack direction="row" mt={4} align="center" spacing={4}>
        <Text fontSize="sm" color="gray.500">
          {project.startDate} - {project.endDate}
        </Text>
        <AvatarGroup size="sm" max={3}>
          {project.employees?.map(emp => (
            <Avatar key={emp.id} name={emp.email} />
          ))}
        </AvatarGroup>
        <Button colorScheme="purple" size="sm" ml="auto" onClick={() => navigate(`/projects/${project.id}/tasks`)}>
          View Tasks
        </Button>
        {onEdit && (
          <Button colorScheme="orange" size="sm" ml={2} onClick={() => onEdit(project)}>
            Edit
          </Button>
        )}
      </Stack>
    </Box>
  );
}