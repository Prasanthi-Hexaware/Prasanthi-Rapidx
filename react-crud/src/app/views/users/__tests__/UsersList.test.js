const { render, screen, cleanup } = require('@testing-library/react')
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import store from 'app/redux/store'
import { BrowserRouter as Router } from 'react-router-dom'
import { SettingsProvider } from 'app/contexts/SettingsContext'
import { MatxTheme } from 'app/components'
import UsersList from '../UsersList'
import axios from '../../../../axios'
import MockAdapter from 'axios-mock-adapter'

afterEach(cleanup)

test('should render Users rows when api response has data', async () => {
    const endPoint = 'users'
    const getUsersListResponse = [
        {
            id: 1,
            name: 'name1',
            id: 68,
        },
    ]
    const mock = new MockAdapter(axios)
    mock.onGet(`/${endPoint}`).reply(200, getUsersListResponse)
    render(
        <Provider store={store}>
            <SettingsProvider>
                <MatxTheme>
                    <Router>
                        <UsersList />
                    </Router>
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    )
    const usersNameCell = await screen.findByText(/name1/i)

    expect(usersNameCell).toHaveTextContent(/name1/i)
    mock.reset()
})
