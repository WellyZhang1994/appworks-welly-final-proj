import React, {useState} from 'react';
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";
import { RootState } from '../reducers/index'
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
import Autocomplete from '@mui/material/Autocomplete';

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



const LoginWeb3 = (setAddress: any) =>
{
    console.log('check matamask')
    if (typeof window.ethereum !== 'undefined') {
		console.log('MetaMask is installed!');
		const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
			Promise.resolve(accounts).then(x =>
            {
                console.log(x)
                setAddress(x[0])
			})
	}
}

const OptimizeWording = (address: string) =>
{
    const stringLength = address.length
    return `${address.slice(0, 6)}...${address.slice(stringLength-5, stringLength) }`;
}

const Header = () =>  {

    const history = useHistory()
    const classes = useStyles()
    const locationName = useLocation().pathname;
    const [address, setAddress] = useState('');
    const loginUser  = useSelector((state: RootState) => state.loginUser)

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
                                            <Grid item style={{marginRight:'20px'}}>
                                                <Button disableRipple className={classes.button} onClick={()=> history.push('/about')}>About Us</Button>
                                            </Grid> 
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={4} md={4} >
                                <TextField
                                    placeholder='Search'
                                    variant={'outlined'}
                                    className={classes.serachInput}
                                    InputProps={{
                                        type: 'search',
                                        style: {
                                            height:'34px',
                                            fontSize:'16px',
                                            width:'450px',
                                            backgroundColor: '#1d2c52',
                                            color: '#98a1c0',
                                            padding: '0 0 0 10px',
                                            borderRadius: 24
                                        },
                                        classes: {
                                            notchedOutline: classes.selectBorder
                                        },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon style={{ color: '#98a1c0' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item lg={4} md={4}>
                                <Grid container alignItems='center' justifyContent='flex-end'>
                                    <Grid item >
                                        {
                                            _.keys(loginUser).length ===0 ? 
                                            <Grid container alignItems='center'>
                                                <Grid item style={{marginRight:'6px'}}>
                                                    <Avatar style={{width:'30px',height:'30px'}}>
                                                    </Avatar>
                                                </Grid>
                                                <Grid item style={{marginRight:'8px'}}>
                                                    <Typography style={{ color: '#98a1c0' }}>{OptimizeWording(address)}</Typography>
                                                </Grid>
                                            </Grid>
                                            :
                                            <Grid container alignItems='center'>
                                                <Grid item style={{marginRight:'6px'}}>
                                                    <Avatar style={{width:'44px',height:'44px'}} >
                                                        <Folder />
                                                    </Avatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography style={{color:'#000'}}>{OptimizeWording(address)}</Typography>
                                                </Grid>
                                                <Grid item >
                                                    <IconButton>
                                                        <ArrowDropDownIcon style={{width:'20px',height:'20px',color:'#000'}}/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                    <Grid item style={{marginRight:'20px'}}>
                                        <Button disableRipple className={classes.button} onClick={() => {  LoginWeb3(setAddress) }}>Connect</Button>
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