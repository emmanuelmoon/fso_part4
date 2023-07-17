const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./user_helper');
const app = require('../app');

const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = helper.initialUsers
    .map((user) => User(user));

  const promiseArray = userObjects.map((user) => user.save());

  await Promise.all(promiseArray);
}, 100000);

describe('Addition of a bad user', () => {
  test('fails with status code 400 if password is undefined', async () => {
    const newUser = {
      username: 'inan',
      name: 'Ian',
    };

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(
      helper.initialUsers.length,
    );

    const names = usersAtEnd.map((r) => r.name);

    expect(names).not.toContain(newUser.name);
  });

  test('fails with status code 400 if username is undefined', async () => {
    const newUser = {
      name: 'Ian',
      password: '383829',
    };

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(
      helper.initialUsers.length,
    );

    const names = usersAtEnd.map((r) => r.name);

    expect(names).not.toContain(newUser.name);
  });

  test('fails with status code 400 if username is less than 3 characters long', async () => {
    const newUser = {
      username: 'in',
      name: 'Ian',
      password: '383829',
    };

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(
      helper.initialUsers.length,
    );

    const names = usersAtEnd.map((r) => r.name);

    expect(names).not.toContain(newUser.name);
  });

  test('fails with status code 400 if password is less than 3 characters long', async () => {
    const newUser = {
      username: 'inan',
      name: 'Ian',
      password: '38',
    };

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(
      helper.initialUsers.length,
    );

    const names = usersAtEnd.map((r) => r.name);

    expect(names).not.toContain(newUser.name);
  });

  test('fails with status code 400 if username is not unique', async () => {
    const newUser = {
      username: 'inan',
      name: 'Ian',
      password: '3832',
    };

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newUser2 = {
      username: 'inan',
      name: 'Lana',
      password: '5994',
    };

    await api
      .post('/api/users/')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(
      helper.initialUsers.length + 1,
    );

    const names = usersAtEnd.map((r) => r.name);

    expect(names).not.toContain(newUser2.name);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
}, 100000);
