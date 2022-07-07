import { createAsyncThunk } from '@reduxjs/toolkit'
import { showSuccess } from 'app/services/notification/store/notification.actions'
import axios from '../../../../axios'

const endPoint = 'users'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(`/${endPoint}`)
    const users = await response.data
    return users
})

export const addUsers = createAsyncThunk(
    'users/addUsers',
    async (data, thunkAPI) => {
        const response = await axios.post(`/${endPoint}`, data)
        const users = await response.data
        thunkAPI.dispatch(showSuccess('Users added successfully'))
        return users
    }
)

export const editUsers = createAsyncThunk(
    'users/editUsers',
    async (data, thunkAPI) => {
        const response = await axios.put(`/${endPoint}/${data.id}`, data)
        const users = await response.data
        thunkAPI.dispatch(showSuccess('Users updated successfully'))
        return users
    }
)

export const deleteUsers = createAsyncThunk(
    'users/deleteUsers',
    async (data, thunkAPI) => {
        const response = await axios.delete(`/${endPoint}/${data.id}`)
        const status = await response.status
        if (status === 200) {
            thunkAPI.dispatch(
                showSuccess('Selected users deleted successfully.')
            )
            return data.id
        }
    }
)
