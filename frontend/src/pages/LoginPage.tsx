import { Box, Button, Heading, Input, Stack, useToast, Text, Flex, Link, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo-full.png'; // <-- Use your full logo
import bgImage from '../assets/login-bg.png'; // <-- Use your background image

const MotionBox = motion(Box);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password, role });
      if (res.data && res.data.userId) {
        localStorage.setItem('userId', res.data.userId);
        // Also save role, as it's returned from the login endpoint
        if (res.data.role) {
          localStorage.setItem('role', res.data.role);
        }
      }
      login();
      toast({ title: 'Login successful!', status: 'success', duration: 2000, isClosable: true });
      navigate('/dashboard');
    } catch {
      toast({ title: 'Invalid credentials', status: 'error' });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        bg="white"
        p={[6, 10]}
        rounded="2xl"
        boxShadow="2xl"
        w={["90vw", "400px"]}
        textAlign="center"
        position="relative"
        opacity={0.97}
      >
        <Flex justify="center" mb={4}>
          <img src={logo} alt="Company Logo" style={{ width: 180, height: 60, objectFit: 'contain' }} />
        </Flex>
        <Heading as="h1" size="lg" mb={2} color="black" fontWeight="extrabold" letterSpacing="wide">
          Welcome to Hagerstone PMS
        </Heading>
        <Text mb={6} color="gray.600" fontWeight="medium">
          Please login to your account
        </Text>
        <Select
          placeholder="Select role"
          value={role}
          onChange={e => setRole(e.target.value)}
          mb={4}
          bg="gray.100"
        >
          <option value="Director">Director</option>
          <option value="Design">Design</option>
          <option value="AI">AI</option>
          <option value="MIS">MIS</option>
          <option value="Procurement">Procurement</option>
          <option value="Finance">Finance</option>
          <option value="Other">Other</option>
        </Select>
        <Stack spacing={4}>
          <Input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            bg="gray.100"
            border="none"
            _focus={{ bg: "gray.200" }}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            bg="gray.100"
            border="none"
            _focus={{ bg: "gray.200" }}
          />
          <Button
            colorScheme="purple"
            size="lg"
            fontWeight="bold"
            onClick={handleLogin}
            _hover={{ bg: "purple.600" }}
            boxShadow="md"
          >
            Login
          </Button>
        </Stack>
        <Text mt={6} color="gray.500" fontSize="sm">
          Don&apos;t have an account?{' '}
          <Link color="purple.500" href="#" fontWeight="bold">
            Signup
          </Link>
        </Text>
      </MotionBox>
    </Flex>
  );
}