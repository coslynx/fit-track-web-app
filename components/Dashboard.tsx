import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  Button,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
} from '@chakra-ui/react';
import { FaDumbbell, FaRunning, FaAppleAlt, FaChartLine } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Goal, Progress as ProgressType } from '@/types';
import { useGoalStore } from '@/stores/goalStore';
import ProgressChart from './ProgressChart';

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recentProgress, setRecentProgress] = useState<ProgressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { addGoal, updateGoal } = useGoalStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session) return;
      try {
        const [goalsResponse, progressResponse] = await Promise.all([
          axios.get('/api/goals', {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          }),
          axios.get('/api/progress/recent', {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
        ]);
        setGoals(goalsResponse.data);
        setRecentProgress(progressResponse.data);
        goalsResponse.data.forEach((goal: Goal) => addGoal(goal));
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, addGoal]);

  const calculateProgress = (goal: Goal) => {
    const currentValue = recentProgress.find(p => p.goalId === goal.id)?.value || 0;
    const progress = (currentValue / goal.targetValue) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getGoalIcon = (goalType: string) => {
    switch (goalType) {
      case 'weight_loss':
      case 'muscle_gain':
        return FaDumbbell;
      case 'endurance':
        return FaRunning;
      case 'nutrition':
        return FaAppleAlt;
      default:
        return FaChartLine;
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
        <Heading as="h1" size="xl" color={textColor}>
          Your Fitness Dashboard
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {goals.map((goal) => (
            <Box key={goal.id} p={5} borderRadius="md" borderWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={getGoalIcon(goal.goalType)} boxSize={6} color="blue.500" />
                  <Heading size="md" color={textColor}>{goal.title}</Heading>
                </HStack>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>{goal.description}</Text>
                <Progress value={calculateProgress(goal)} width="100%" colorScheme="blue" />
                <Stat>
                  <StatLabel>Current Progress</StatLabel>
                  <StatNumber>{recentProgress.find(p => p.goalId === goal.id)?.value || 0} / {goal.targetValue} {goal.unit}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={calculateProgress(goal) >= 50 ? 'increase' : 'decrease'} />
                    {calculateProgress(goal).toFixed(1)}%
                  </StatHelpText>
                </Stat>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                  Target Date: {format(parseISO(goal.targetDate), 'MMM dd, yyyy')}
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                  {differenceInDays(parseISO(goal.targetDate), new Date())} days remaining
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            Recent Progress
          </Heading>
          <ProgressChart />
        </Box>

        <Box mt={8}>
          <Button colorScheme="blue" onClick={() => window.location.href = '/goals/new'}>
            Set New Goal
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Dashboard;