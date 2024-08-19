import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  useColorModeValue,
  IconButton,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Goal } from '@/types';
import { useGoalStore } from '@/stores/goalStore';
import GoalForm from '@/components/GoalForm';
import { useRouter } from 'next/router';

const GoalsPage: React.FC = () => {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { addGoal, updateGoal, removeGoal } = useGoalStore();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!session) return;
      try {
        const response = await axios.get('/api/goals', {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        setGoals(response.data);
        response.data.forEach((goal: Goal) => addGoal(goal));
      } catch (err) {
        setError('Failed to fetch goals. Please try again later.');
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [session, addGoal]);

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    onOpen();
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!session) return;
    try {
      await axios.delete(`/api/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setGoals(goals.filter(goal => goal.id !== goalId));
      removeGoal(goalId);
      toast({
        title: 'Goal deleted',
        description: 'Your goal has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete goal. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error deleting goal:', err);
    }
  };

  const handleGoalSubmit = async (goalData: Partial<Goal>) => {
    if (!session) return;
    try {
      if (editingGoal) {
        const response = await axios.put(`/api/goals/${editingGoal.id}`, goalData, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        const updatedGoal = response.data;
        setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
        updateGoal(updatedGoal.id, updatedGoal);
        toast({
          title: 'Goal updated',
          description: 'Your goal has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const response = await axios.post('/api/goals', goalData, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        const newGoal = response.data;
        setGoals([...goals, newGoal]);
        addGoal(newGoal);
        toast({
          title: 'Goal created',
          description: 'Your new goal has been successfully created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      setEditingGoal(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${editingGoal ? 'update' : 'create'} goal. Please try again.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(`Error ${editingGoal ? 'updating' : 'creating'} goal:`, err);
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="red.500">{error}</Box>;
  }

  return (
    <Box bg={bgColor} p={5} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Flex align="center">
          <Heading as="h1" size="xl" color={textColor}>
            Your Fitness Goals
          </Heading>
          <Spacer />
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => {
            setEditingGoal(null);
            onOpen();
          }}>
            Add New Goal
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {goals.map((goal) => (
            <Box key={goal.id} p={5} borderRadius="md" borderWidth={1} borderColor={borderColor}>
              <VStack align="start" spacing={3}>
                <Heading size="md" color={textColor}>{goal.title}</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>{goal.description}</Text>
                <Text fontWeight="bold">
                  Target: {goal.targetValue} {goal.unit}
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                  Due: {format(parseISO(goal.targetDate), 'MMM dd, yyyy')}
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                  {differenceInDays(parseISO(goal.targetDate), new Date())} days remaining
                </Text>
                <Flex width="100%">
                  <IconButton
                    aria-label="Edit goal"
                    icon={<FaEdit />}
                    onClick={() => handleEditGoal(goal)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete goal"
                    icon={<FaTrash />}
                    onClick={() => handleDeleteGoal(goal.id)}
                    colorScheme="red"
                  />
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <GoalForm initialData={editingGoal} onSubmit={handleGoalSubmit} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default GoalsPage;