import React from 'react';
import { Box, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  if (status === 'loading') {
    return <Box>Loading...</Box>;
  }

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Header />
      <VStack spacing={8} align="stretch" p={5}>
        {session ? (
          <Dashboard />
        ) : (
          <Box textAlign="center" py={10}>
            <Heading as="h1" size="2xl" mb={6} color={textColor}>
              Welcome to FitTrack
            </Heading>
            <Text fontSize="xl" mb={8} color={textColor}>
              Start tracking your fitness goals and achieve more with FitTrack.
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => router.push('/api/auth/signin')}
            >
              Get Started
            </Button>
          </Box>
        )}
      </VStack>
      <Footer />
    </Box>
  );
};

export default HomePage;