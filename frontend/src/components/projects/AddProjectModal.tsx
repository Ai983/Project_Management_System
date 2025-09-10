import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Button, Input, Textarea, Stack, Select as ChakraSelect, FormLabel, useColorModeValue
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import ReactSelect from 'react-select';
  
  type Employee = {
    id: string;
    email: string;
    name: string;
  };
  
  type AddProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (project: any) => void;
    employees: Employee[];
  };
  
  export default function AddProjectModal({
    isOpen,
    onClose,
    onAdd,
    employees,
  }: AddProjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [status, setStatus] = useState('Not Started');
    const [assigned, setAssigned] = useState<Employee[]>([]);
  
    const handleSubmit = () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const employeeIds = assigned
        .map(emp => emp.id)
        .filter(id => !!id && uuidRegex.test(id));
      console.log("Sending employees:", employeeIds);
      onAdd({
        name,
        description,
        startDate: startDate ? startDate.toISOString().split('T')[0] : '',
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        status,
        employees: employeeIds,
      });
      setName('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setStatus('Not Started');
      setAssigned([]);
    };
  
    // Dark theme colors
    const modalBg = useColorModeValue('gray.900', 'gray.800');
    const textColor = useColorModeValue('white', 'gray.100');
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={modalBg} color={textColor}>
          <ModalHeader>Add New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Input
                placeholder="Project Name"
                value={name}
                onChange={e => setName(e.target.value)}
                bg="gray.700"
                color="white"
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                bg="gray.700"
                color="white"
              />
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={<Input bg="gray.700" color="white" />}
              />
              <FormLabel>End Date</FormLabel>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={<Input bg="gray.700" color="white" />}
              />
              <ChakraSelect
                value={status}
                onChange={e => setStatus(e.target.value)}
                bg="gray.700"
                color="white"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </ChakraSelect>
              <FormLabel>Assign Employees</FormLabel>
              <ReactSelect
                isMulti
                options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
                value={assigned.map(emp => ({ value: emp.id, label: emp.name }))}
                onChange={selected => {
                  setAssigned(
                    Array.isArray(selected)
                      ? selected.map(sel => employees.find(emp => emp.id === sel.value)!)
                      : []
                  );
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    background: '#2D3748',
                    color: 'white',
                  }),
                  menu: (base) => ({
                    ...base,
                    background: '#2D3748',
                    color: 'white',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    background: '#805ad5',
                    color: 'white',
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isFocused ? '#805ad5' : '#2D3748',
                    color: 'white',
                  }),
                }}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={handleSubmit}>
              Add Project
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }