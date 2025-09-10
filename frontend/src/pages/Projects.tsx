import { Box, Heading, Button, useDisclosure, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import AddProjectModal from '../components/projects/AddProjectModal';
import EditProjectModal from '../components/projects/EditProjectModal';

// Define the shape of a project object for TypeScript.
// This interface will be used to type our state, solving both the error and the warning.
interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  employees: any[]; // Ideally, define a more specific Employee type here as well
}

export default function Projects() {
  // CRITICAL FIX: Use the Project type with useState to tell TypeScript
  // what kind of objects will be in this array. This resolves the 'never[]' error.
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<any[]>([]); // Also type the employees state
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editProject, setEditProject] = useState<Project | null>(null);
  const toast = useToast();

  useEffect(() => {
    // Fetch both projects and users at the same time
    Promise.all([
      api.get('/projects'),
      api.get('/users')
    ])
    .then(([projectsRes, usersRes]) => {
      setProjects(projectsRes.data);
      setEmployees(usersRes.data);
    })
    .catch(err => {
      console.error("Failed to load data", err);
      // Here you could add a toast notification for the error
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // This function will be called from the modal to add a new project to the list
  const handleAddProject = (newProjectData: any) => {
    // Call the backend to create the new project
    api.post('/projects', newProjectData)
      .then(res => {
        // The backend returns the new project object.
        // We add it directly to our existing state.
        // This is more efficient than refetching the whole list.
        setProjects(prevProjects => [...prevProjects, res.data]);
        
        onClose(); // Close the modal on success
      })
      .catch(err => {
        console.error("Failed to add project", err);
        // You can add a user-facing error message here (e.g., a toast)
      });
  };

  const handleEditProject = (project: Project) => {
    setEditProject(project);
  };

  const handleSaveEdit = async (id: string, updatedProject: any) => {
    try {
      await api.put(`/projects/${id}`, updatedProject);
      // Refetch projects after update
      const projectsRes = await api.get('/projects');
      setProjects(projectsRes.data);
      setEditProject(null);
    } catch (err) {
      console.error('Failed to update project', err);
      toast({ title: 'Failed to update project', status: 'error' });
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, #f0f2f5, #e9d8fd 80%)" p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="gray.700">Projects</Heading>
        <Button colorScheme="purple" onClick={onOpen} size="lg" boxShadow="md">
          + Add Project
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      ) : projects.length > 0 ? (
        projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} onEdit={handleEditProject} />
        ))
      ) : (
        <Text color="gray.500" textAlign="center" mt={10}>
          No projects found. Click "+ Add Project" to get started!
        </Text>
      )}

      <AddProjectModal
        isOpen={isOpen}
        onClose={onClose}
        onAdd={handleAddProject}
        employees={employees}
      />

      <EditProjectModal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        project={editProject}
        onSave={handleSaveEdit}
        employees={employees}
      />
    </Box>
  );
}