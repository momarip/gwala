import app from './app';

const startServer = async () => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
};

startServer().catch((error) => {
  console.error('Error starting the server:', error);
});
