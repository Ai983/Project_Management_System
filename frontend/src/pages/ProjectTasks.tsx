import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api, { fetchTeams } from '../services/api';
import {
  Box, Heading, Progress, Text, Stack,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure
} from '@chakra-ui/react';

export default function ProjectTasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    api.get(`/tasks?projectId=${id}`).then(res => setTasks(res.data));
    fetchTeams().then(setTeams);
  }, [id]);

  useEffect(() => {
    if (selectedTask) {
      api.get(`/tasks/${selectedTask.id}/comments`).then(res => setComments(res.data));
    }
  }, [selectedTask]);

  // Group tasks by teamId
  const tasksByTeam: { [teamId: string]: any[] } = {};
  tasks.forEach(task => {
    const key = task.teamId || 'none';
    if (!tasksByTeam[key]) tasksByTeam[key] = [];
    tasksByTeam[key].push(task);
  });

  // Helper to get team name
  const getTeamName = (teamId: string) => {
    if (teamId === 'none') return 'Unassigned';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  // Helper to get team progress
  const getTeamProgress = (teamTasks: any[]) => {
    if (teamTasks.length === 0) return 0;
    return Math.round(teamTasks.reduce((sum, t) => sum + (t.percentComplete || 0), 0) / teamTasks.length);
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Tasks for Project</Heading>
      <Accordion allowMultiple>
        {Object.entries(tasksByTeam).map(([teamId, teamTasks]) => (
          <AccordionItem key={teamId}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">{getTeamName(teamId)}</Text>
                <Text fontSize="sm" color="gray.600">Team Progress: {getTeamProgress(teamTasks)}%</Text>
                <Progress value={getTeamProgress(teamTasks)} size="sm" colorScheme="purple" mt={1} />
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Stack spacing={4}>
                {teamTasks.map((task: any) => (
                  <Box
                    key={task.id}
                    p={3}
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => { setSelectedTask(task); onOpen(); }}
                  >
                    <Text fontWeight="bold">{task.title}</Text>
                    <Text>Status: {task.status}</Text>
                    <Text>Progress: {task.percentComplete}%</Text>
                    <Progress value={task.percentComplete} size="xs" colorScheme="green" mt={2} />
                    <Text fontSize="sm" color="gray.500">Assignee: {task.assignee?.name || 'Unassigned'}</Text>
                    <Text fontSize="sm" color="gray.500">Team: {task.team?.name || (task.assignee?.team?.name ?? 'Unassigned')}</Text>
                  </Box>
                ))}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Task Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Details</ModalHeader>
          <ModalBody>
            {selectedTask && (
              <>
                <Text fontWeight="bold">{selectedTask.title}</Text>
                <Text>Status: {selectedTask.status}</Text>
                <Text>Progress: {selectedTask.percentComplete}%</Text>
                <Text>Description: {selectedTask.description}</Text>
                <Text>Assignee: {selectedTask.assignee?.name || 'Unassigned'}</Text>
                <Text>Team: {selectedTask.team?.name || (selectedTask.assignee?.team?.name ?? 'Unassigned')}</Text>
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>Comments & Attachments</Text>
                  {comments.length === 0 ? (
                    <Text color="gray.500">No comments yet.</Text>
                  ) : (
                    comments.map((c, i) => (
                      <Box key={i} p={2} mb={2} bg="gray.50" borderRadius="md">
                        <Text fontWeight="bold">{c.user?.name || c.user?.email}</Text>
                        <Text fontSize="sm" color="gray.600">{c.comment}</Text>
                        {c.attachment && (
                          <a href={c.attachment} target="_blank" rel="noopener noreferrer" style={{ color: '#805ad5' }}>
                            View Attachment
                          </a>
                        )}
                        <Text fontSize="xs" color="gray.400">{new Date(c.createdAt).toLocaleString()}</Text>
                      </Box>
                    ))
                  )}
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}


