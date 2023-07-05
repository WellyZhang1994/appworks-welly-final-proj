import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";
import { RootState } from '../reducers/index'
import { loginUser } from '../actions/companyAction'
import {
    Grid,
    AppBar,
    Toolbar,
    Button,
    Typography,
} from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {
    Folder
} from '@material-ui/icons';
import { IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import _ from 'lodash'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import { ethers } from "ethers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        main: {
            width: '100%',
            height: '10vh',
            backgroundImage: "linear-gradient(to bottom, #111524, #080917)"
        },
        bar: {
            backgroundColor:'#0D111C',
            boxShadow: '0px 4px 10px rgba(0, 115, 250, 0.1)',
            height:'10vh'
        },
        serachInput: {
            width:'400px',
            [`& fieldset`]: {
                borderRadius: 30
            },
        },
        button: {
            height: '30px',
            width: '110px',
            color: '#6399e4',
            backgroundColor: '#1d2c52',
            borderRadius: 20
        },
        selectBorder: {
            borderColor: "transparent !important"
        },
        autoCompleted: {
            height: '30px',
            width: '110px',
            color: '#6399e4',
            backgroundColor: '#1d2c52',
            borderRadius: 40
        }
    })
);

const ConnectWallet = async (setAddress: any, dispatch:any) =>
{
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])
    dispatch(loginUser(accounts[0]))
}

const OptimizeWording = (address: string) =>
{
    const stringLength = address.length
    return address === '' ? '' : `${address.slice(0, 6)}...${address.slice(stringLength-5, stringLength) }`;
}

const Header = () =>  {

    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const locationName = useLocation().pathname;
    const loginUser = useSelector((state: RootState) => state.loginUser)

    return(
        <Grid container direction={'row'} className={classes.main} >
            <Grid item style={{width:'100%'}}>
                <AppBar position="fixed" className={classes.bar}>
                    <Toolbar>
                        <Grid container  alignItems='center' style={{ height: '100px', width: '100%' }}>
                            <Grid item lg={4} md={4}>
                                <Grid container alignContent='center' justifyContent='flex-start'>
                                    <Grid item style={{marginRight: '36px'}}>
                                        <Typography style={{color:'#98a1c0'}} onClick={()=> history.push('/')}>{'Logo'}</Typography>
                                    </Grid>
                                    <Grid item >
                                        <Grid container>
                                            <Grid item style={{marginRight:'20px'}}>
                                                <Button disableRipple className={classes.button} onClick={()=> history.push('/company')} >Company</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={4} md={4} >
                                
                            </Grid>
                            <Grid item lg={4} md={4}>
                                <Grid container alignItems='center' justifyContent='flex-end'>
                                    <Grid item >
                                        {
                                            <Grid container alignItems='center'>
                                                <Grid item style={{marginRight:'6px'}}>
                                                    <Avatar style={{width:'30px',height:'30px'}}>
                                                    </Avatar>
                                                </Grid>
                                                <Grid item style={{marginRight:'8px'}}>
                                                    <Typography style={{ color: '#98a1c0' }}>{OptimizeWording(loginUser)}</Typography>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                    <Grid item style={{marginRight:'20px'}}>
                                        <Button disableRipple className={classes.button} onClick={() => {  ConnectWallet(loginUser,dispatch) }}>Connect</Button>
                                    </Grid>
                                </Grid>
                            </Grid> 
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Grid>
        </Grid>
    )
}


export default Header