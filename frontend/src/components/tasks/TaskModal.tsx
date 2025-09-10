// src/components/tasks/TaskModal.tsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Stack,
    useToast,
    Text,
    Badge,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { predictDelay } from '../../services/mlinsights';
  import { sendNotification } from '../../services/notifications';
  import Select from 'react-select';
  import { useEffect } from 'react';
  import { fetchTeams } from '../../services/api';
  
  export default function TaskModal({ onSave }: { onSave: (data: any) => void }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
  
    const [taskData, setTaskData] = useState({
      id: '',  
      title: '',
      status: '',
      plannedEnd: '',
      assigneeId: '',
      teamId: '', // Added teamId to state
    });
  
    const [delayRisk, setDelayRisk] = useState<number | null>(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState<{ value: string; label: string } | null>(null);

    useEffect(() => {
      fetchTeams().then(setTeams);
    }, []);

    const teamOptions = teams.map((team: any) => ({ value: team.id, label: team.name }));
  
    const handlePredict = async () => {
      try {
        const result = await predictDelay(taskData.id); // Optional: use temp taskId if needed
        setDelayRisk(result.delayRisk);
      } catch {
        toast({ title: 'ML prediction failed', status: 'error' });
      }
    };
  
    const handleSubmit = async () => {
      try {
        onSave(taskData);
  
        // Optionally trigger notification
        await sendNotification({
          userId: taskData.assigneeId || 'default-user-id', // fallback
          message: `New task assigned: ${taskData.title}`,
          channel: 'in-app',
        });
  
        toast({ title: 'Task saved & notified', status: 'success' });
      } catch {
        toast({ title: 'Save failed', status: 'error' });
      }
      onClose();
    };
  
    return (
      <>
        <Button onClick={onOpen} colorScheme="green">+ Add Task</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Task</ModalHeader>
            <ModalBody>
              <Stack spacing={4}>
                <Input
                  placeholder="Title"
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Status"
                  onChange={(e) =>
                    setTaskData({ ...taskData, status: e.target.value })
                  }
                />
                <Input
                  placeholder="Planned End (yyyy-mm-dd)"
                  onChange={(e) =>
                    setTaskData({ ...taskData, plannedEnd: e.target.value })
                  }
                />
                <Input
                  placeholder="Assignee User ID (optional)"
                  onChange={(e) =>
                    setTaskData({ ...taskData, assigneeId: e.target.value })
                  }
                />
                <Select
                  options={teamOptions}
                  value={selectedTeam}
                  onChange={option => {
                    setSelectedTeam(option);
                    setTaskData({ ...taskData, teamId: option ? option.value : '' });
                  }}
                  placeholder="Select Team"
                  isClearable
                />
  
                <Button size="sm" onClick={handlePredict}>Predict Delay</Button>
  
                {delayRisk !== null && (
                  <Text>
                    Predicted Delay:{' '}
                    <Badge
                      colorScheme={
                        delayRisk > 80 ? 'red' : delayRisk > 50 ? 'orange' : 'green'
                      }
                    >
                      {delayRisk}%
                    </Badge>
                  </Text>
                )}
              </Stack>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSubmit}>Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  