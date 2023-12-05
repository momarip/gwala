import userResolvers from './userResolvers';
import questionResolvers from './questionResolvers';

const resolvers = {
  ...userResolvers,
  ...questionResolvers,
  // ... add other resolvers if you have more files
};

export default resolvers;
