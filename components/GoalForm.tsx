import React, { useState, useEffect } from 'react';
import { Box, VStack, FormControl, FormLabel, Input, Textarea, Button, useToast, Heading, Select } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useColorModeValue } from '@chakra-ui/react';
import { format, addDays } from 'date-fns';
import { Goal } from '@/types';
import { useGoalStore } from '@/stores/goalStore';

const GoalForm: React.FC = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const { addGoal, updateGoal } = useGoalStore();

  const [goalTypes, setGoalTypes] = useState([
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'custom', label: 'Custom' }
  ]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(100, 'Title is too long'),
    description: Yup.string().max(500, 'Description is too long'),
    targetValue: Yup.number().required('Target value is required').positive('Target value must be positive'),
    targetDate: Yup.date().required('Target date is required').min(new Date(), 'Target date must be in the future'),
    goalType: Yup.string().required('Goal type is required'),
    unit: Yup.string().when('goalType', {
      is: 'custom',
      then: Yup.string().required('Unit is required for custom goals'),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      targetValue: '',
      targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      goalType: '',
      unit: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to create a goal.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await axios.post('/api/goals', values, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });

        const newGoal: Goal = response.data;
        addGoal(newGoal);

        toast({
          title: 'Goal created',
          description: 'Your fitness goal has been successfully created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        router.push('/goals');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to create goal. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Error creating goal:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.goalType === 'custom') {
      formik.setFieldValue('unit', '');
    } else {
      const selectedGoalType = goalTypes.find(type => type.value === formik.values.goalType);
      if (selectedGoalType) {
        switch (selectedGoalType.value) {
          case 'weight_loss':
          case 'muscle_gain':
            formik.setFieldValue('unit', 'kg');
            break;
          case 'endurance':
            formik.setFieldValue('unit', 'minutes');
            break;
          case 'flexibility':
            formik.setFieldValue('unit', 'cm');
            break;
          default:
            formik.setFieldValue('unit', '');
        }
      }
    }
  }, [formik.values.goalType]);

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" maxWidth="600px" margin="auto">
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" textAlign="center" color={textColor}>
          Create New Fitness Goal
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={formik.touched.title && !!formik.errors.title}>
              <FormLabel htmlFor="title">Goal Title</FormLabel>
              <Input
                id="title"
                name="title"
                placeholder="Enter your goal title"
                {...formik.getFieldProps('title')}
              />
              {formik.touched.title && formik.errors.title && (
                <Box color="red.500" fontSize="sm">{formik.errors.title}</Box>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={formik.touched.goalType && !!formik.errors.goalType}>
              <FormLabel htmlFor="goalType">Goal Type</FormLabel>
              <Select
                id="goalType"
                name="goalType"
                placeholder="Select goal type"
                {...formik.getFieldProps('goalType')}
              >
                {goalTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              {formik.touched.goalType && formik.errors.goalType && (
                <Box color="red.500" fontSize="sm">{formik.errors.goalType}</Box>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={formik.touched.targetValue && !!formik.errors.targetValue}>
              <FormLabel htmlFor="targetValue">Target Value</FormLabel>
              <Input
                id="targetValue"
                name="targetValue"
                type="number"
                placeholder="Enter your target value"
                {...formik.getFieldProps('targetValue')}
              />
              {formik.touched.targetValue && formik.errors.targetValue && (
                <Box color="red.500" fontSize="sm">{formik.errors.targetValue}</Box>
              )}
            </FormControl>

            {formik.values.goalType === 'custom' && (
              <FormControl isRequired isInvalid={formik.touched.unit && !!formik.errors.unit}>
                <FormLabel htmlFor="unit">Unit</FormLabel>
                <Input
                  id="unit"
                  name="unit"
                  placeholder="Enter the unit for your custom goal"
                  {...formik.getFieldProps('unit')}
                />
                {formik.touched.unit && formik.errors.unit && (
                  <Box color="red.500" fontSize="sm">{formik.errors.unit}</Box>
                )}
              </FormControl>
            )}

            <FormControl isRequired isInvalid={formik.touched.targetDate && !!formik.errors.targetDate}>
              <FormLabel htmlFor="targetDate">Target Date</FormLabel>
              <Input
                id="targetDate"
                name="targetDate"
                type="date"
                {...formik.getFieldProps('targetDate')}
              />
              {formik.touched.targetDate && formik.errors.targetDate && (
                <Box color="red.500" fontSize="sm">{formik.errors.targetDate}</Box>
              )}
            </FormControl>

            <FormControl isInvalid={formik.touched.description && !!formik.errors.description}>
              <FormLabel htmlFor="description">Description (Optional)</FormLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a description for your goal"
                {...formik.getFieldProps('description')}
              />
              {formik.touched.description && formik.errors.description && (
                <Box color="red.500" fontSize="sm">{formik.errors.description}</Box>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Creating Goal"
              width="full"
            >
              Create Goal
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default GoalForm;