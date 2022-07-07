import axios from '../../../../../axios'
import MockAdapter from 'axios-mock-adapter'
import store from 'app/redux/store'
import { fetchUsers, addUsers, editUsers, deleteUsers } from '../users.action'

const getUsersListResponse = [
    {
        id: 1,
        name: 'name',
        id: 57,
    },
]

const addUsersListResponse = (data) => {
    return { id: 2, ...data }
}
const editUsersListResponse = (data) => {
    return data
}

describe('should test Users redux tooklit asyncThunk api action and redux store updation', () => {
    const mock = new MockAdapter(axios)
    const endPoint = 'users'
    test('Should be able to fetch the users list and update users redux store', async () => {
        mock.onGet(`/${endPoint}`).reply(200, getUsersListResponse)
        const result = await store.dispatch(fetchUsers())
        const usersList = result.payload
        expect(result.type).toBe('users/fetchUsers/fulfilled')
        expect(usersList).toEqual(getUsersListResponse)

        const state = store.getState().users
        expect(state.entities).toEqual(usersList)
    })

    test('Should be able to add new users to list and make post api and update users redux store', async () => {
        const body = {
            name: 'name',
            id: 37,
        }
        mock.onPost(`/${endPoint}`, body).reply(201, addUsersListResponse(body))
        const result = await store.dispatch(addUsers(body))
        const usersItem = result.payload
        expect(result.type).toBe('users/addUsers/fulfilled')
        expect(usersItem).toEqual(addUsersListResponse(body))

        const state = store.getState().users
        expect(state.entities).toContainEqual(addUsersListResponse(body))
    })

    test('Should be able to edit users in list and make put api call and update users redux store', async () => {
        const body = {
            id: 1,
            name: 'name',
            id: 90,
        }
        mock.onPut(`/${endPoint}/${body.id}`, body).reply(
            201,
            editUsersListResponse(body)
        )
        const result = await store.dispatch(editUsers(body))
        const usersItem = result.payload
        expect(result.type).toBe('users/editUsers/fulfilled')
        expect(usersItem).toEqual(editUsersListResponse(body))

        const state = store.getState().users
        let changedUsers = state.entities.find((p) => p.id === body.id)
        expect(changedUsers.name).toEqual(body.name)
    })

    test('Should be able to delete users in list and update users redux store', async () => {
        const input = {
            id: 2,
        }
        mock.onDelete(`/${endPoint}/${input.id}`, input).reply(200)
        let state = store.getState().users
        const initialLength = state.entities.length
        const result = await store.dispatch(deleteUsers(input))
        const deletId = result.payload
        expect(result.type).toBe('users/deleteUsers/fulfilled')
        expect(deletId).toEqual(input.id)

        state = store.getState().users
        const updateLength = initialLength - 1
        expect(state.entities.length).toEqual(updateLength)
    })
})
