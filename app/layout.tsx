import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { theme } from '@/styles/theme';
import { useGoalStore } from '@/stores/goalStore';
import { useUserStore } from '@/stores/userStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { fetchGoals } = useGoalStore();
  const { fetchUser } = useUserStore();

  React.useEffect(() => {
    fetchUser().catch(console.error);
    fetchGoals().catch(console.error);
  }, [fetchUser, fetchGoals]);

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ChakraProvider theme={theme}>
            <Box minHeight="100vh" display="flex" flexDirection="column">
              <Header />
              <Box flex="1" as="main">
                {children}
              </Box>
              <Footer />
            </Box>
          </ChakraProvider>
        </SessionProvider>
      </body>
    </html>
  );
}