import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import { Box, Flex } from '@chakra-ui/react';
import Kanban from './pages/Kanban';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';     
import Tasks from './pages/Tasks'; 
import Sidebar from './components/layout/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProjectTasks from './pages/ProjectTasks';
import Notifications from './pages/Notifications';

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  return (
        <Routes>
          <Route path="/" element={<LoginPage />} />
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Flex>
              <Sidebar />
              <Box ml="200px" flex="1">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/kanban" element={<Kanban />} />
                  <Route path="/projects/:id/tasks" element={<ProjectTasks />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/notifications" element={<Notifications />} />
                  {/* Add more protected routes here if needed */}
        </Routes>
      </Box>
    </Flex>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  </ChakraProvider>
);
export default App;
