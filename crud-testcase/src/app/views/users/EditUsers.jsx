import { Breadcrumb, SimpleCard } from 'app/components'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { editUsers } from './store/users.action'
import { Button, Icon, Grid, MenuItem } from '@mui/material'
import { styled } from '@mui/system'
import { Span } from 'app/components/Typography'
import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}))

const EditUsers = () => {
    const { id: usersId } = useParams()

    const users = useSelector((state) =>
        state.users.entities.find(
            (users) => users.id.toString() === usersId.toString()
        )
    )

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState(users.email)
    const [isactive, setIsactive] = useState(users.isactive)

    const handleEmail = (e) => setEmail(e.target.value)
    const handleIsactive = (e) => setIsactive(e.target.value)

    const handleClick = (e) => {
        e.preventDefault()
        dispatch(
            editUsers({
                id: usersId,
                email,
                isactive,
            })
        )
        navigate('/users')
    }

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'EditUsers', path: '/users' },
                        { name: 'Form' },
                    ]}
                />
            </div>
            <SimpleCard title="Edit Form">
                <ValidatorForm onSubmit={handleClick} onError={() => null}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="text"
                                name="email"
                                id="emailInput"
                                onChange={handleEmail}
                                value={email}
                                validators={['required']}
                                label="Email"
                                errorMessages={['this field is required']}
                            />
                            <TextField
                                value={isactive}
                                onChange={handleIsactive}
                                select
                                id="isactiveInput"
                                label="Isactive"
                                validators={['required']}
                                errorMessages={['this field is required']}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Button type="submit" color="primary" variant="contained">
                        <Icon>send</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Save
                        </Span>
                    </Button>
                </ValidatorForm>
            </SimpleCard>
        </Container>
    )
}

export default EditUsers
