import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import { Box, Heading, VStack } from '@chakra-ui/react';

export default function KanbanColumn({ columnId, title, tasks, onCardClick }: { columnId: string; title: string; tasks: any[]; onCardClick: (task: any) => void }) {
  return (
    <Box minW="280px" bg="gray.50" borderRadius="md" p={3} boxShadow="md">
      <Heading size="md" mb={3}>{title}</Heading>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <VStack
            ref={provided.innerRef}
            {...provided.droppableProps}
            spacing={3}
            minH="100px"
            bg={snapshot.isDraggingOver ? 'purple.50' : 'gray.50'}
            borderRadius="md"
            transition="background 0.2s"
          >
            {tasks.map((task, idx) => (
              <KanbanCard key={task.id} task={task} index={idx} onClick={() => onCardClick(task)} />
            ))}
            {provided.placeholder}
          </VStack>
        )}
      </Droppable>
    </Box>
  );
} 