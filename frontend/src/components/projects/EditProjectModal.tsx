import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ReactSelect from 'react-select';

export default function EditProjectModal({ isOpen, onClose, project, onSave, employees }: any) {
  const [form, setForm] = useState<any>({});
  const toast = useToast();

  useEffect(() => {
    if (project) setForm(project);
  }, [project]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Only send allowed fields
    const { name, description, startDate, endDate, id } = form;
    const employees = Array.isArray(form.employees)
      ? form.employees.map((e: any) => typeof e === 'string' ? e : e.value)
      : [];
    onSave(id, { name, description, startDate, endDate, employees });
    toast({ title: 'Project updated', status: 'success' });
  };

  const employeeOptions = employees.map((emp: any) => ({ value: emp.id, label: emp.name || emp.email }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Project</ModalHeader>
        <ModalBody>
          <Input name="name" placeholder="Project Name" value={form.name || ''} onChange={handleChange} mb={2} />
          <Input name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} mb={2} />
          <Input name="startDate" type="date" value={form.startDate || ''} onChange={handleChange} mb={2} />
          <Input name="endDate" type="date" value={form.endDate || ''} onChange={handleChange} mb={2} />
          <ReactSelect
            isMulti
            options={employeeOptions}
            value={employeeOptions.filter((opt: any) => (form.employees || []).includes(opt.value))}
            onChange={selected => setForm({ ...form, employees: selected.map((opt: any) => opt.value) })}
            placeholder="Select Employees"
            closeMenuOnSelect={false}
            styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 