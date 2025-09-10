import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Box, Text, Badge } from '@chakra-ui/react';

export default function KanbanCard({ task, index, onClick }: { task: any; index: number; onClick?: () => void }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow={snapshot.isDragging ? 'lg' : 'md'}
          borderLeft="4px solid #805ad5"
          w="100%"
          cursor="pointer"
          onClick={onClick}
        >
          <Text fontWeight="bold">{task.title}</Text>
          <Text fontSize="sm" color="gray.600">{task.description}</Text>
          <Badge colorScheme={task.status === 'Completed' ? 'green' : 'purple'} mt={2}>{task.status}</Badge>
        </Box>
      )}
    </Draggable>
  );
} 