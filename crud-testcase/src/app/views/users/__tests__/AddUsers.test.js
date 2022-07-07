const {
    render,
    screen,
    fireEvent,
    within,
    waitFor,
    getByRole,
    act,
    cleanup,
} = require('@testing-library/react')
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import store from 'app/redux/store'
import { BrowserRouter as Router } from 'react-router-dom'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import { MatxTheme } from 'app/components'
import axios from '../../../../axios'
import MockAdapter from 'axios-mock-adapter'
import AddUsers from '../AddUsers'

beforeEach(() => {
    const endPoint = 'users'
    const getStudentListResponse = [
        {
            id: 1,
            email: 'email',
            isactive: false,
        },
    ]
    const mock = new MockAdapter(axios)
    mock.onGet(`/${endPoint}`).reply(200, getStudentListResponse)
    render(
        <Provider store={store}>
            <SettingsProvider>
                <MatxTheme>
                    <Router>
                        <AddUsers />
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

describe('testing view UsersAdd Component', () => {
    test('should render AddUsers and to display Add Form title', async () => {
        const headingNote = screen.getByText(/Add Form/i)
        expect(headingNote).toBeInTheDocument()
    })

    test('should have all input fields present in the add form', async () => {
        const addUsersButtonElement = screen.getByRole('button', {
            name: /Add/i,
        })

        const emailElement = screen.getByLabelText(/Email/i)
        const isactiveElement = screen.getByLabelText(/Isactive/i)

        expect(addUsersButtonElement).toBeInTheDocument()

        expect(emailElement).toBeInTheDocument()
        expect(isactiveElement).toBeInTheDocument()
    })

    test('should be able to give inputs to all fields of Users add form', async () => {
        const emailElement = screen.getByLabelText(/Email/i)
        const isactiveElement = screen.getByLabelText(/Isactive/i)

        fireEvent.change(emailElement, { target: { value: 'email' } })

        fireEvent.mouseDown(isactiveElement)
        const isactivelistbox = within(screen.getByRole('listbox'))
        fireEvent.click(isactivelistbox.getByText(/False/))
        expect(isactiveElement).toHaveTextContent(/False/i)
    })

    test('should return error message when add Users button is clicked on invalid form', async () => {
        jest.useFakeTimers()
        const addUsersButtonElement = screen.getByRole('button', {
            name: /Add/i,
        })

        await clickAndWait(addUsersButtonElement)

        let errorList = await screen.findAllByText('this field is required')
        expect(errorList).toHaveLength(2)
    })
})
