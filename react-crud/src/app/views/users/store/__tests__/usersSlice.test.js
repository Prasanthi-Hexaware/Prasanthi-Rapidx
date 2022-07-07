import store from 'app/redux/store'
import { usersAdded, usersDeleted, usersUpdated } from '../usersSlice'

describe('testing users redux store reducers', () => {
    test('add users to store test', () => {
        let state = store.getState().users
        expect(state.entities).toHaveLength(0)
        const initialInput = {
            id: 1,
            name: 'name',
            id: 86,
        }
        store.dispatch(usersAdded(initialInput))
        state = store.getState().users
        expect(state.entities).toHaveLength(1)
    })

    test('update users from store should change the length of the entities array in redux store', () => {
        const initialInput = {
            id: 2,
            name: 'name',
            id: 45,
        }
        store.dispatch(usersAdded(initialInput))
        let state = store.getState().users
        expect(state.entities).toHaveLength(2)

        const updatedInput = {
            id: initialInput.id,
            name: 'name1',
            id: 33,
        }
        store.dispatch(usersUpdated(updatedInput))
        state = store.getState().users
        let changedUsers = state.entities.find((p) => p.id === 2)
        expect(changedUsers).toStrictEqual(updatedInput)
    })

    test('delete users from store should reduce the length of the entities array in redux store', () => {
        const initialInput = {
            id: 3,
            name: 'name',
            id: 74,
        }
        store.dispatch(usersAdded(initialInput))
        let state = store.getState().users
        expect(state.entities).toHaveLength(3)

        store.dispatch(
            usersDeleted({
                id: initialInput.id,
            })
        )
        state = store.getState().users
        expect(state.entities).toHaveLength(2)
    })
})
