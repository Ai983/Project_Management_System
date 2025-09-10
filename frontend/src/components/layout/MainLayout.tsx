import { Flex } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Flex flex="1" p={6}>{children}</Flex>
      </Flex>
    </Flex>
  );
}
