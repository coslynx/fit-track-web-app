import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { format } from 'date-fns';
import { useGoalStore } from '@/stores/goalStore';
import { Goal, Progress } from '@/types';
import ProgressChart from '@/components/ProgressChart';

const ProgressPage: React.FC = () => {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [progressValue, setProgressValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { addGoal } = useGoalStore();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!session) return;
      try {
        const response = await axios.get('/api/goals', {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        setGoals(response.data);
        response.data.forEach((goal: Goal) => addGoal(goal));
        if (response.data.length > 0) {
          setSelectedGoal(response.data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch goals. Please try again later.');
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [session, addGoal]);

  const handleGoalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoal(event.target.value);
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !selectedGoal || !progressValue) return;

    setSubmitting(true);
    try {
      const response = await axios.post('/api/progress',
        {
          goalId: selectedGoal,
          value: parseFloat(progressValue),
          date: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );

      setProgressValue('');
      toast({
        title: 'Progress logged',
        description: 'Your progress has been successfully recorded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to log progress. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error logging progress:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Box color="red.500">{error}</Box>;
  }

  return (
    <Box bg={bgColor} p={5} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color={textColor}>
          Track Your Progress
        </Heading>

        <Box as="form" onSubmit={handleProgressSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="goal">Select Goal</FormLabel>
              <Select
                id="goal"
                value={selectedGoal}
                onChange={handleGoalChange}
                placeholder="Choose a goal"
              >
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="progress">Progress Value</FormLabel>
              <Input
                id="progress"
                type="number"
                step="0.01"
                value={progressValue}
                onChange={(e) => setProgressValue(e.target.value)}
                placeholder="Enter your progress"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={submitting}
              loadingText="Logging Progress"
              isDisabled={!selectedGoal || !progressValue}
            >
              Log Progress
            </Button>
          </VStack>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            Progress Overview
          </Heading>
          <ProgressChart />
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            Recent Progress Entries
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {goals.map((goal) => (
              <Box key={goal.id} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                <Text fontWeight="bold">{goal.title}</Text>
                <Text fontSize="sm" color="gray.500">
                  Target: {goal.targetValue} {goal.unit}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Due: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProgressPage;