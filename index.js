const express = require('express');
const expressGraphQl = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL Schema
const schema = buildSchema(`
  type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
  }

  type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
  }

  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
`);

const courseData = [
  {
      id: 1,
      title: 'The Complete Node.js Developer Course',
      author: 'Andrew Mead, Rob Percival',
      description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
      topic: 'Node.js',
      url: 'https://codingthesmartway.com/courses/nodejs/'
  },
  {
      id: 2,
      title: 'Node.js, Express & MongoDB Dev to Deployment',
      author: 'Brad Traversy',
      description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
      topic: 'Node.js',
      url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
  },
  {
      id: 3,
      title: 'JavaScript: Understanding The Weird Parts',
      author: 'Anthony Alicea',
      description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
      topic: 'JavaScript',
      url: 'https://codingthesmartway.com/courses/understand-javascript/'
  }
];

const getCourse = ({id}) => {
  return courseData.filter(c => c.id === id)[0];
};

const getCourses = ({topic}) => {
  if (topic) {
    return courseData.filter(c => c.topic === topic);
  }
  return courseData;
}

const updateCourseTopic = ({id, topic}) => {
  courseData.map(course => {
    if (course.id === id) {
        course.topic = topic;
        return course;
    }
  });
  return courseData.filter(course => course.id === id)[0];  
}

const root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic
};

// Create an express app with GraphQL endpoint

const app = express();
app.use('/graphql', expressGraphQl({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(4000, () => console.log('Server started on port 4000'));

/**
  GraphiQL Queries
  1.
  query getSingleCourse($courseId: Int!) {
    course(id:$courseId) {
      title
      author
      description
      topic
      url
    }
  }
  2. 
  query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
    course1: course(id: $courseID1) {
      ...courseFields
    },
    course2: course(id: $courseID2) {
          ...courseFields
    }
  }

  3.
  mutation updateCourseTopic($id: Int!, $topic: String!) {
    updateCourseTopic(id: $id, topic: $topic) {
      ...courseFields
    }
  }

  fragment courseFields on Course {
    title
    author
    description
    topic
    url
  }
 */