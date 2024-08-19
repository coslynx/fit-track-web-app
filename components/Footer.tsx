import React from 'react';
import { Box, Container, Flex, Text, Link, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box as="footer" bg={bgColor} color={textColor} py={8}>
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={{ base: 4, md: 0 }}>
            <Text fontWeight="bold" fontSize="lg" mr={2}>
              FitTrack
            </Text>
            <Text fontSize="sm" textAlign={{ base: 'center', md: 'left' }}>
              © {new Date().getFullYear()} FitTrack. All rights reserved.
            </Text>
          </Flex>
          <Flex align="center">
            <Link href="/privacy" mr={4} fontSize="sm">
              Privacy Policy
            </Link>
            <Link href="/terms" mr={4} fontSize="sm">
              Terms of Service
            </Link>
            <IconButton
              as="a"
              href="https://github.com/spectra-ai-codegen/fit-track-web-app"
              aria-label="GitHub"
              icon={<FaGithub />}
              size="sm"
              colorScheme="gray"
              variant="ghost"
              mr={2}
            />
            <IconButton
              as="a"
              href="https://twitter.com/fittrack"
              aria-label="Twitter"
              icon={<FaTwitter />}
              size="sm"
              colorScheme="twitter"
              variant="ghost"
              mr={2}
            />
            <IconButton
              as="a"
              href="https://www.linkedin.com/company/fittrack"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
              size="sm"
              colorScheme="linkedin"
              variant="ghost"
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;