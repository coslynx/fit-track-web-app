import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Avatar,
  Button,
  Input,
  Textarea,
  useToast,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { format } from 'date-fns';
import { useGoalStore } from '@/stores/goalStore';
import { Goal, Post } from '@/types';

const SocialPage: React.FC = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Goal[]>([]);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { goals } = useGoalStore();

  useEffect(() => {
    const fetchSocialData = async () => {
      if (!session) return;
      try {
        const [postsResponse, achievementsResponse] = await Promise.all([
          axios.get('/api/social/posts', {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          }),
          axios.get('/api/social/achievements', {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
        ]);
        setPosts(postsResponse.data);
        setRecentAchievements(achievementsResponse.data);
      } catch (err) {
        setError('Failed to fetch social data. Please try again later.');
        console.error('Error fetching social data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, [session]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newPost.trim()) return;

    try {
      const response = await axios.post('/api/social/posts', 
        { content: newPost },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      setPosts([response.data, ...posts]);
      setNewPost('');
      toast({
        title: 'Post created',
        description: 'Your post has been successfully shared.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error creating post:', err);
    }
  };

  const handleShareAchievement = async (goalId: string) => {
    if (!session) return;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const response = await axios.post('/api/social/posts', 
        { 
          content: `I've achieved my goal: ${goal.title}!`,
          goalId: goalId 
        },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      setPosts([response.data, ...posts]);
      toast({
        title: 'Achievement shared',
        description: 'Your achievement has been successfully shared.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to share achievement. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error sharing achievement:', err);
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
          FitTrack Social
        </Heading>

        <Box as="form" onSubmit={handlePostSubmit}>
          <VStack spacing={3} align="stretch">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your fitness journey..."
              resize="vertical"
            />
            <Button type="submit" colorScheme="blue" isDisabled={!newPost.trim()}>
              Post
            </Button>
          </VStack>
        </Box>

        {recentAchievements.length > 0 && (
          <Box>
            <Heading as="h2" size="md" mb={3} color={textColor}>
              Recent Achievements
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {recentAchievements.map((achievement) => (
                <Box key={achievement.id} p={3} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                  <Text fontWeight="bold">{achievement.title}</Text>
                  <Button size="sm" mt={2} onClick={() => handleShareAchievement(achievement.id)}>
                    Share
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        <Box>
          <Heading as="h2" size="md" mb={3} color={textColor}>
            Community Feed
          </Heading>
          <VStack spacing={4} align="stretch">
            {posts.map((post) => (
              <Box key={post.id} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
                <HStack spacing={3} mb={2}>
                  <Avatar size="sm" name={post.author.name} src={post.author.image} />
                  <Text fontWeight="bold">{post.author.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {format(new Date(post.createdAt), 'MMM dd, yyyy HH:mm')}
                  </Text>
                </HStack>
                <Text>{post.content}</Text>
                {post.goalId && (
                  <Text mt={2} fontSize="sm" color="blue.500">
                    Achievement: {goals.find(g => g.id === post.goalId)?.title}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SocialPage;