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
import { commentAbi, commentProxyAddress } from '../../contracts/comment';
import { transTokenABI, transTokenAddress } from '../../contracts/transToken';
import { ethers } from "ethers";

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


const CompanyPage = (props:Props) :React.ReactElement<Props>  =>  {

    const classes = useStyles()
    const history = useHistory()
    const theme: {[key: string]: {[key: string]:string}}  = useSelector((state: RootState) => state.theme)
    const themeSelected :string = useSelector((state: RootState) => state.themeSelected)
    const dispatch = useDispatch()
    const loginUser = useSelector((state: RootState) => state.loginUser)

    const createComments = async () =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        const transaction = await commentContractInstance.createComment("first company", "test", 10000)
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
            alert('error message');
        return;
        }
        console.log(transactionReceipt)
    }

    useEffect(() =>
    {
        if (!_.isEmpty((window as any).ethereum) && loginUser !== '')
        {
            const init = async () =>
            {
                
                const provider = new ethers.BrowserProvider(window.ethereum)
                const signer = await provider.getSigner()
                const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
                const result = await commentContractInstance.getCompanyList();
                result.map((x:any) =>
                {
                    console.log(x)
                })

                const resultv2 = await commentContractInstance.getCommentsByCompany('first company');
                resultv2.map((x: any) =>
                {
                    console.log(x['1'])
                })
            }
            init()
        }

    })

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' className={classes.main}>
            <Grid container direction='column' alignItems='center' className={classes.mainContainer}>
                {'Company Page'}
                <Button onClick={()=> createComments()}>
                    {'Create a comment'}
                </Button>
            </Grid>
        </Grid>

    )
}

export default CompanyPage