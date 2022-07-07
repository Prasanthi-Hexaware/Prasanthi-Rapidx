import { createSlice } from '@reduxjs/toolkit'
import { fetchUsers } from './users.action'
import { addUsers } from './users.action'
import { editUsers } from './users.action'
import { deleteUsers } from './users.action'

const fetchUsersExtraReducer = {
    [fetchUsers.pending]: (state, action) => {
        state.loading = true
    },
    [fetchUsers.fulfilled]: (state, action) => {
        state.entities = [...action.payload]
        state.loading = false
    },
    [fetchUsers.rejected]: (state, action) => {
        state.loading = false
    },
}

const addUsersExtraReducer = {
    [addUsers.pending]: (state, action) => {
        state.loading = true
    },
    [addUsers.fulfilled]: (state, action) => {
        state.entities.push(action.payload)
        state.loading = false
    },
    [addUsers.rejected]: (state, action) => {
        state.loading = false
    },
}

const editUsersExtraReducer = {
    [editUsers.pending]: (state, action) => {
        state.loading = true
    },
    [editUsers.fulfilled]: (state, action) => {
        const { id, name, id } = action.payload
        const existingUsers = state.entities.find(
            (users) => users.id.toString() === id.toString()
        )
        if (existingUsers) {
            existingUsers.name = name
            existingUsers.id = id
        }
        state.loading = false
    },
    [editUsers.rejected]: (state, action) => {
        state.loading = false
    },
}

const deleteUsersExtraReducer = {
    [deleteUsers.pending]: (state, action) => {
        state.loading = true
    },
    [deleteUsers.fulfilled]: (state, action) => {
        const id = action.payload
        const existingUsers = state.entities.find(
            (users) => users.id.toString() === id.toString()
        )
        if (existingUsers) {
            state.entities = state.entities.filter((users) => users.id !== id)
        }
        state.loading = false
    },
    [deleteUsers.rejected]: (state, action) => {
        state.loading = false
    },
}
const usersSlice = createSlice({
    name: 'users',
    initialState: {
        entities: [],
        loading: false,
    },
    reducers: {
        usersAdded(state, action) {
            state.entities.push(action.payload)
        },
        usersUpdated(state, action) {
            const { id, name, id } = action.payload
            const existingUsers = state.entities.find(
                (users) => users.id.toString() === id.toString()
            )
            if (existingUsers) {
                existingUsers.name = name
                existingUsers.id = id
            }
        },
        usersDeleted(state, action) {
            const { id } = action.payload
            const existingUsers = state.entities.find(
                (users) => users.id.toString() === id.toString()
            )
            if (existingUsers) {
                state.entities = state.entities.filter(
                    (users) => users.id !== id
                )
            }
        },
    },
    extraReducers: {
        ...fetchUsersExtraReducer,
        ...addUsersExtraReducer,
        ...editUsersExtraReducer,
        ...deleteUsersExtraReducer,
    },
})

export const { usersAdded, usersUpdated, usersDeleted } = usersSlice.actions

export default usersSlice.reducer
