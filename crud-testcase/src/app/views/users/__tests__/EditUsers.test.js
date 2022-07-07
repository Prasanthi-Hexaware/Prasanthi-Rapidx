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
            email: 'email',
            isactive: false,
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
        const emailElement = screen.getByLabelText(/Email/i)
        const isactiveElement = screen.getByLabelText(/Isactive/i)

        expect(saveUsersButtonElement).toBeInTheDocument()

        expect(emailElement).toBeInTheDocument()
        expect(isactiveElement).toBeInTheDocument()
    })

    test('should be able to give inputs to all fields of Users edit form', async () => {
        const emailElement = screen.getByLabelText(/Email/i)
        const isactiveElement = screen.getByLabelText(/Isactive/i)

        fireEvent.change(emailElement, { target: { value: 'email' } })

        expect(emailElement.value).toBe('email')

        fireEvent.mouseDown(isactiveElement)
        const isactivelistbox = within(screen.getByRole('listbox'))
        fireEvent.click(isactivelistbox.getByText(/False/))
        expect(isactiveElement).toHaveTextContent(/False/i)
    })

    test('should return error message when save button is clicked on invalid form', async () => {
        jest.useFakeTimers()
        const emailElement = screen.getByLabelText(/Email/i)

        fireEvent.change(emailElement, { target: { value: '' } })
        await act(async () => {
            jest.runOnlyPendingTimers()
        })
        const saveUsersButtonElement = screen.getByRole('button', {
            name: /save/i,
        })

        await clickAndWait(saveUsersButtonElement)

        const errorList = await screen.findAllByText('this field is required')
        expect(errorList).toHaveLength(1)
    })
})
