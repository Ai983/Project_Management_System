import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Flex bg="blue.500" p={4} color="white">
      <Text fontWeight="bold">Hagerstone ERP</Text>
      <Spacer />
      <Button size="sm" onClick={handleLogout}>Logout</Button>
    </Flex>
  );
}
