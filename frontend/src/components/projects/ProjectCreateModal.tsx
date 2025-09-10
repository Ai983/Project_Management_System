import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Input, useDisclosure
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import axios from 'axios';
  
  export default function ProjectCreateModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
  
    const createProject = async () => {
      
      await axios.post(
        'http://localhost:3000/projects',
        { name, startDate: start, endDate: end },
        
      );
      onClose();
    };
  
    return (
      <>
        <Button onClick={onOpen}>+ New Project</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Project</ModalHeader>
            <ModalBody>
              <Input placeholder="Project Name" onChange={(e) => setName(e.target.value)} />
              <Input type="date" placeholder="Start Date" onChange={(e) => setStart(e.target.value)} />
              <Input type="date" placeholder="End Date" onChange={(e) => setEnd(e.target.value)} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={createProject}>Create</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
