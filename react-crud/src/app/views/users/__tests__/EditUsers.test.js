const {
    render,
    screen,
    fireEvent,
    within,
    getByRole,
    act,
    cleanup,
} = require('@testing-library/react')
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import store from 'app/redux/store'
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import { MatxTheme } from 'app/components'
import EditUsers from '../EditUsers'
import { usersAdded } from '../store/usersSlice'
beforeAll(() => {
    store.dispatch(
        usersAdded({
            id: 1,
            name: 'name',
            id: 7,
        })
    )
})

beforeEach(() => {
    render(
        <Provider store={store}>
            <SettingsProvider>
                <MatxTheme>
                    <Router>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="users/edit/1" replace />}
                            />
                            <Route
                                path="users/edit/:id"
                                element={<EditUsers />}
                            />
                        </Routes>
                    </Router>
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    )
})

const clickAndWait = async (element) => {
    await act(async () => {
        fireEvent.click(element)
    })

    await act(async () => {
        jest.runOnlyPendingTimers()
    })
}

afterEach(cleanup)

describe('testing view of UsersEdit Component', () => {
    test('should render EditUsers and display the heading Edit Form', async () => {
        const headingNote = screen.getByText(/Edit Form/i)
        expect(headingNote).toBeInTheDocument()
    })

    test('should have all input fields present in the edit form', async () => {
        const saveUsersButtonElement = screen.getByRole('button', {
            name: /save/i,
        })
        const nameElement = screen.getByLabelText(/Name/i)
        const idElement = screen.getByLabelText(/Id/i)

        expect(saveUsersButtonElement).toBeInTheDocument()

        expect(nameElement).toBeInTheDocument()
        expect(idElement).toBeInTheDocument()
    })

    test('should be able to give inputs to all fields of Users edit form', async () => {
        const nameElement = screen.getByLabelText(/Name/i)
        const idElement = screen.getByLabelText(/Id/i)

        fireEvent.change(nameElement, { target: { value: 'name' } })
        fireEvent.change(idElement, { target: { value: 21 } })

        expect(nameElement.value).toBe('name')

        expect(idElement.value).toBe('21')
    })

    test('should return error message when save button is clicked on invalid form', async () => {
        jest.useFakeTimers()
        const nameElement = screen.getByLabelText(/Name/i)
        const idElement = screen.getByLabelText(/Id/i)

        fireEvent.change(nameElement, { target: { value: '' } })
        fireEvent.change(idElement, { target: { value: '' } })
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        const saveUsersButtonElement = screen.getByRole('button', {
            name: /save/i,
        })

        await clickAndWait(saveUsersButtonElement)

        const errorList = await screen.findAllByText('this field is required')
        expect(errorList).toHaveLength(2)
    })
})
