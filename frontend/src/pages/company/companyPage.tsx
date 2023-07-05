import React, { useEffect, useState } from 'react';
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
import NativeSelect from '@mui/material/NativeSelect';
import MenuItem from '@mui/material/MenuItem';
import { ethers } from "ethers";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

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
            width: '700px',
            backgroundColor: '#FFF',
            boxShadow: '0px 0px 20px rgba(0, 115, 250, 0.1)'
        },
        loginWord: {
            fontSize:'20px',
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
    const [selectedCompany, setSelectedCompany] = useState<string>("")
    const [companyList, setCompanyList] = useState<string[]>([])
    const [commentListByCompany, setCommentListByCompany] = useState<string[]>([])

    const [digOpen, setDigOpen] = React.useState(false);
    const [companyName, setCompanyName] = React.useState('');
    const [companyDescription, setCompanyDescription] = React.useState('');
    const [userSalary, setUserSalary] = React.useState(0);
    
    const handleClickOpen = () => {
        setDigOpen(true);
    };
    const handleClose = () => {
        setDigOpen(false);
    };

    const createComments = async (companyName: string, companyDescription: string, userSalary: number) =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        const transaction = await commentContractInstance.createComment(companyName, companyDescription, userSalary)
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
            alert('error message');
        return;
        }
        console.log(transactionReceipt)
        getCompanyList()
    }

    const getCompanyList = async () =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        const result = await commentContractInstance.getCompanyList();
        setCompanyList(result)

        const resultv2 = await commentContractInstance.getCommentsByCompany(result[0]);
        const commentList:any = resultv2.map((comment: any) =>
        {
            const tempResult = {
                id: Number(comment['0']),
                salary: ethers.formatUnits(comment['1'], 0),
                createTime: new Date(Number(comment['2'])),
                name: comment['3'],
                description: comment['4'],
                creator: comment['5'],
                status: ethers.formatUnits(comment['6'], 0),
                votes: comment['7']
            }
            return tempResult;
        })
        setCommentListByCompany(commentList);
        return commentList;
    }

    const getCompanyByComapany = async (companyName: string) =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        const result = await commentContractInstance.getCommentsByCompany(companyName);
        const commentList:any = result.map((comment: any) =>
        {
            const tempResult = {
                id: Number(comment['0']),
                salary: ethers.formatUnits(comment['1'], 0),
                createTime: new Date(Number(comment['2'])),
                name: comment['3'],
                description: comment['4'],
                creator: comment['5'],
                status: ethers.formatUnits(comment['6'], 0),
                votes: comment['7']
            }
            return tempResult;
        })
        setCommentListByCompany(commentList);
        return commentList;
    }
    
    useEffect(() =>
    {
        if (!_.isEmpty((window as any).ethereum) && loginUser !== '')
        {
            const init = async () =>
            {
                await getCompanyList();
            }
            init()
        }
    }, [loginUser])

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' className={classes.main}>
            <Grid container direction='column' className={classes.mainContainer}>
                <Grid item container justifyContent='flex-start' alignContent='center'>
                    <Grid item style={{marginRight:'20px'}}>
                         <Typography className={classes.loginWord}>
                            {"Companies"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <NativeSelect
                            inputProps={{
                                name: 'age',
                                id: 'uncontrolled-native',
                            }}
                            value={selectedCompany}
                            onChange={(event) =>
                            {
                                setSelectedCompany(event.target.value);
                                getCompanyByComapany(event.target.value);
                            }
                            }
                        >
                            {companyList.map((com) =>
                            {
                                return <option key={com} value={com}>{com}</option>
                            })}
                        </NativeSelect>
                    </Grid>
                </Grid>
                <Grid item container justifyContent='space-between' alignContent='center'>
                    <Grid item>
                         <Typography className={classes.loginWord}>
                            {"Comments"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' style={{backgroundColor:'#98a1c0'}} onClick={()=> handleClickOpen()}>
                            <Typography style={{color: '#FFF'}}>
                                {"Create Comments"}
                            </Typography>
                        </Button>
                        <Dialog open={digOpen} onClose={handleClose}>
                            <DialogTitle>Create Comment</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                Please input company name, description and salary.
                            </DialogContentText>
                            <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Company Name"
                                    type="text"
                                    value={companyName}  
                                    onChange={(event)=> setCompanyName(event.target.value)}
                                    fullWidth
                                    variant="standard"
                                />
                            <TextField
                                margin="dense"
                                id="name"
                                label="Comapny Description"
                                type="text"
                                value={companyDescription}
                                onChange={(event)=> setCompanyDescription(event.target.value)}
                                fullWidth
                                variant="standard"
                                />
                            <TextField
                                margin="dense"
                                id="name"
                                label="Salary"
                                type="number"
                                value={userSalary}
                                onChange={(event)=> setUserSalary(parseFloat(event.target.value))}
                                fullWidth
                                variant="standard"
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={() => { createComments(companyName, companyDescription, userSalary);  handleClose();}}>Create</Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </Grid>
                <Grid item container style={{marginTop:'20px'}} direction='column' alignContent='flex-start'>
                    {
                        commentListByCompany.map((comment: any) =>
                        {
                            return (
                                <Card key={comment.id }  style={{ width: '100%' }}>
                                    <Grid container direction='column'>
                                        <Grid item container justifyContent='space-between'>
                                            <Grid item>
                                                <CardContent>
                                                    <Typography >
                                                        {comment.name}
                                                    </Typography>
                                                </CardContent>
                                            </Grid>
                                            <Grid item>
                                                <CardContent>
                                                    <Typography >
                                                        {comment.createTime.toLocaleString()}
                                                    </Typography>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                         <Grid item container justifyContent='space-between'>
                                            <Grid item>
                                                <CardContent>
                                                    <Typography >
                                                        {comment.description}
                                                    </Typography>
                                                </CardContent>
                                            </Grid>
                                            <Grid item>
                                                <CardContent>
                                                    <Typography >
                                                        {comment.salary}
                                                    </Typography>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                   
                                    <CardActions>
                                        <Button size="small">Detail</Button>
                                    </CardActions>
                                </Card>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </Grid>

    )
}

export default CompanyPage