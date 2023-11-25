const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {userOneId, userOne, setupDatabase, closeDatabase, taskThreeId } = require('./fixtures/db');


beforeEach(async() => {
    await setupDatabase();
});






test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From test suite'
        })
        .expect(201);
    
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
})


test('Should get all task for user', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
        expect(response.body.length).toBe(2);
})

test('Should fail to delete task of other user', async() => {
    const response = await request(app)
        .delete(`/task/${taskThreeId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)

    const task = Task.findById(taskThreeId);
    expect(task).not.toBeNull();
})

afterAll(async() => {
    await closeDatabase();
});