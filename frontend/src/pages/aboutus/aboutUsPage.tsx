import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { RootState } from '../../reducers/index'
import {
    Grid,
    Button,
    TextField,
    InputAdornment,
    Typography
} from '@material-ui/core';

import { Checkbox } from '@mui/material';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash'
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface Props {
    children: JSX.Element | JSX.Element[];
}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        main: {
            display: 'flex',
            width: '100%',
            height: '90vh',
            backgroundColor: '#f5f5f5'
        },
        mainContainer: {
            borderRadius:10,
            padding: '40px 50px',
            height: '570px',
            width: '500px',
            backgroundColor: '#FFF',
            boxShadow: '0px 0px 20px rgba(0, 115, 250, 0.1)'
        },
        loginWord: {
            fontSize:'30px',
            color:'#C17767',
            fontWeight: 800,
            fontFamily:'Lato, Noto Sans TC'
        },
        h1: {
            fontSize:'14px',
            color:'#9e9e9e',
            fontWeight: 800,
            fontFamily:'Lato, Noto Sans TC'
        },
        serachInput: {
            [`& fieldset`]: {
                borderRadius: 5,
            },
        },
        selectBorder:{
            borderColor: "transparent !important"
        },
        changeButton: {
            borderRadius:5,
            color:'#FFF',
            backgroundColor: '#5A91FF',
            width:'100%',
            height:'40px',
            boxShadow:'none',
            '&:hover': {
                backgroundColor:'#5A91FF',
                boxShadow:'none'
            },
        },
    })
);


const AboutUsPage = (props:Props) :React.ReactElement<Props>  =>  {

    const classes = useStyles()
    const history = useHistory()
    const theme: {[key: string]: {[key: string]:string}}  = useSelector((state: RootState) => state.theme)
    const themeSelected :string = useSelector((state: RootState) => state.themeSelected)
    const dispatch = useDispatch()

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' className={classes.main}>
            <Grid container direction='column' justifyContent='space-between' alignItems='center' className={classes.mainContainer}>
                {'About Us Page'}
            </Grid>
        </Grid>

    )
}

export default AboutUsPage