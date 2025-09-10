import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
const MotionBox = motion(Box);


export default function MLInsights() {
  const [taskId, setTaskId] = useState('');
  const [result, setResult] = useState('');

  const handlePredict = async () => {
    const res = await axios.post('http://localhost:3000/mlinsights/predict', { taskId });
    setResult(res.data.predictedDelay);
  };

  return (
    <MotionBox
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={4}>
        <Input placeholder="Task ID" value={taskId} onChange={(e) => setTaskId(e.target.value)} />
        <Button onClick={handlePredict} colorScheme="blue">Predict Delay</Button>
        {result && <Text>Predicted Delay: {result} days</Text>}
      </VStack>
    </MotionBox>
  );
}

