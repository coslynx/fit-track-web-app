import React from 'react';
import { Box, Flex, Spacer, Button, Image, useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleAuthAction = () => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Goals', path: '/goals' },
    { name: 'Progress', path: '/progress' },
    { name: 'Social', path: '/social' },
  ];

  return (
    <Box as="header" bg={bgColor} color={textColor} py={4} px={8} boxShadow="sm">
      <Flex align="center">
        <Link href="/" passHref>
          <Image src="/logo.png" alt="FitTrack Logo" height="40px" width="auto" cursor="pointer" />
        </Link>
        <Spacer />
        <Flex align="center">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path} passHref>
              <Button
                as="a"
                variant="ghost"
                mx={2}
                fontWeight={router.pathname === item.path ? 'bold' : 'normal'}
                color={router.pathname === item.path ? 'brand.500' : textColor}
                _hover={{ color: 'brand.500' }}
              >
                {item.name}
              </Button>
            </Link>
          ))}
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            ml={2}
          />
          <Button
            onClick={handleAuthAction}
            colorScheme="brand"
            ml={4}
          >
            {session ? 'Sign Out' : 'Sign In'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;