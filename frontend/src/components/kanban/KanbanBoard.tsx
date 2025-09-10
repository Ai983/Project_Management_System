import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import api from '../../services/api';
import { Box, Flex, Heading, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Stack, Input, Avatar, Checkbox } from '@chakra-ui/react';

const COLUMNS = [
  { id: 'Inbox', title: 'Inbox' },
  { id: 'Today', title: 'Today' },
  { id: 'ThisWeek', title: 'This Week' },
  { id: 'Completed', title: 'Completed' },
  { id: 'Later', title: 'Later' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('role') || '');
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('userId') || '');

  useEffect(() => {
    api.get('/projects').then(res => {
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0].id);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setLoading(true);
      api.get(`/tasks?projectId=${selectedProject}`).then(res => setTasks(res.data)).finally(() => setLoading(false));
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedTask) {
      api.get(`/tasks/${selectedTask.id}/comments`).then(res => setComments(res.data));
    }
  }, [selectedTask]);

  // Group tasks by stage/status
  const tasksByColumn: { [key: string]: any[] } = {};
  COLUMNS.forEach(col => { tasksByColumn[col.id] = []; });
  tasks.forEach(task => {
    const col = task.status || 'Inbox';
    if (tasksByColumn[col]) tasksByColumn[col].push(task);
    else tasksByColumn['Inbox'].push(task);
  });

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    // Update task status in backend
    const task = tasks.find(t => t.id === draggableId);
    if (task) {
      await api.put(`/tasks/${task.id}`, { status: destination.droppableId });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: destination.droppableId } : t));
    }
  };

  const handleCardClick = (task: any) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleAddComment = async () => {
    if (!selectedTask) return;
    if (!newComment.trim() && !attachment) return;
    try {
      let attachmentUrl = '';
      if (attachment) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', attachment);
        const res = await api.post(`/tasks/${selectedTask.id}/attachment`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        attachmentUrl = res.data.url;
        setUploading(false);
      }
      await api.post(`/tasks/${selectedTask.id}/comments`, {
        userId,
        comment: newComment.trim(),
        attachment: attachmentUrl,
      });
      setNewComment('');
      setAttachment(null);
      const res = await api.get(`/tasks/${selectedTask.id}/comments`);
      setComments(res.data);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleApprove = async (commentId: string, approved: boolean) => {
    await api.put(`/tasks/comments/${commentId}/approve`, { approved });
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, approved } : c));
  };

  if (loading) return <Box p={8}>Loading...</Box>;
  if (!selectedProject) return <Box p={8}>Please select a project.</Box>;

  return (
    <Box p={4} w="100%">
      <Heading mb={6}>Kanban Board</Heading>
      <Select
        placeholder="Select Project"
        value={selectedProject}
        onChange={e => setSelectedProject(e.target.value)}
        mb={4}
        maxW="400px"
      >
        {projects.map((proj: any) => (
          <option key={proj.id} value={proj.id}>{proj.name}</option>
        ))}
      </Select>
      {selectedProject && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={4} overflowX="auto">
            {COLUMNS.map(col => (
              <KanbanColumn key={col.id} columnId={col.id} title={col.title} tasks={tasksByColumn[col.id]} onCardClick={handleCardClick} />
            ))}
          </Flex>
        </DragDropContext>
      )}
      {/* Modal for daily updates and approvals */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="2xl">
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
                        <Flex align="center" gap={2}>
                          <Avatar size="sm" name={c.user?.name || c.user?.email} />
                          <Box flex="1">
                            <Text fontWeight="bold">{c.user?.name || c.user?.email}</Text>
                            <Text fontSize="sm" color="gray.600">{c.comment}</Text>
                            {c.attachment && (
                              <a href={`http://localhost:3000${c.attachment}`} target="_blank" rel="noopener noreferrer" style={{ color: '#805ad5' }}>
                                View Attachment
                              </a>
                            )}
                            <Text fontSize="xs" color="gray.400">{new Date(c.createdAt).toLocaleString()}</Text>
                          </Box>
                          {/* Approve checkbox for heads/directors */}
                          {(userRole === 'Director' || userRole === 'TeamHead') && (
                            <Checkbox isChecked={c.approved} onChange={e => handleApprove(c.id, e.target.checked)}>
                              Approve
                            </Checkbox>
                          )}
                        </Flex>
                      </Box>
                    ))
                  )}
                </Box>
                {/* Add comment/attachment form for employees */}
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>Add Daily Update</Text>
                  <Flex gap={2} align="center">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      bg="white"
                    />
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => setAttachment(e.target.files?.[0] || null)}
                      w="auto"
                      p={1}
                      bg="white"
                    />
                    <Button colorScheme="purple" onClick={handleAddComment} isLoading={uploading} disabled={!newComment.trim() && !attachment}>
                      Add
                    </Button>
                  </Flex>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 