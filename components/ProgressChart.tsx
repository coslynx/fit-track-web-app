import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, HStack, Text, Select, Spinner } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useColorModeValue } from '@chakra-ui/react';
import { Goal, Progress } from '@/types';

const ProgressChart: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('week');
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const lineColor = useColorModeValue('#3182CE', '#63B3ED');

  useEffect(() => {
    const fetchGoals = async () => {
      if (!session) return;
      try {
        const response = await axios.get('/api/goals', {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        setGoals(response.data);
        if (response.data.length > 0) {
          setSelectedGoal(response.data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch goals. Please try again later.');
        console.error('Error fetching goals:', err);
      }
    };

    fetchGoals();
  }, [session]);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!selectedGoal || !session) return;
      setLoading(true);
      try {
        const endDate = new Date();
        let startDate;
        switch (timeRange) {
          case 'week':
            startDate = subWeeks(endDate, 1);
            break;
          case 'month':
            startDate = subMonths(endDate, 1);
            break;
          case 'year':
            startDate = subMonths(endDate, 12);
            break;
          default:
            startDate = subDays(endDate, 7);
        }

        const response = await axios.get(`/api/progress`, {
          params: {
            goalId: selectedGoal,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          },
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });

        const formattedData = response.data.map((item: Progress) => ({
          ...item,
          date: format(new Date(item.date), 'MMM dd'),
          value: Number(item.value)
        }));

        setProgressData(formattedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch progress data. Please try again later.');
        console.error('Error fetching progress data:', err);
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [selectedGoal, timeRange, session]);

  const handleGoalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoal(event.target.value);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(event.target.value);
  };

  if (error) {
    return (
      <Box bg={bgColor} p={5} borderRadius="md" boxShadow="md">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} p={5} borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" color={textColor}>
          Progress Chart
        </Heading>
        <HStack justifyContent="space-between">
          <Select value={selectedGoal} onChange={handleGoalChange} w="60%">
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </Select>
          <Select value={timeRange} onChange={handleTimeRangeChange} w="35%">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </Select>
        </HStack>
        {loading ? (
          <Spinner size="xl" alignSelf="center" />
        ) : (
          <Box h="400px" w="100%">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ProgressChart;