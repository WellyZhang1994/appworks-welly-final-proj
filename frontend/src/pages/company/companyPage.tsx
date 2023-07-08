import React, { useEffect, useState, useCallback } from 'react';
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
import _, { set } from 'lodash'
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
import LoadingOverlay from 'react-loading-overlay-ts';
import Chip from '@mui/material/Chip';

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
            height: '90%',
            width: '600px',
            backgroundColor: '#FFF',
            boxShadow: '0px 0px 20px rgba(0, 115, 250, 0.1)',
            overflowY: "auto",
            whiteSpace: "nowrap",
            position: 'relative'
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

    const [companyName, setCompanyName] = React.useState('');
    const [companyDescription, setCompanyDescription] = React.useState('');
    const [userSalary, setUserSalary] = React.useState(0);

    const [detailOpen, setDetailOpen] = React.useState(false);
    const [digOpen, setDigOpen] = React.useState(false);
    const [depositOpen, setDepositOpen] = React.useState(false);
    const [addonTikectOpen, setAddonTicketOpen] = React.useState(false);

    const [companyDetail, setCompanyDetail] = React.useState<any>({});
    const [votes, setVotes] = React.useState(0);
    
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = React.useState<number>(0);
    const [totalVotes, setTotalVotes] = React.useState<number>(0);
    const [depositTokenAmount, setDepositTokenAmount] = React.useState<number>(0);
    const [addonValue, setAddonValue] = React.useState<number>(0);

    const handleClickOpen = (f: any) => {
        f(true);
    };
    const handleClose = (f:any) => {
        f(false);
    };

    const handleDetailClickOpen = async(id: number, name:string) =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        const comment = await commentContractInstance.getCommentDetails(id, name)
        if (comment)
        {
            const votes = {
                'agree': _.values(comment['7']['1']),
                'against': _.values(comment['7']['0'])
            }
            const tempResult = {
                id: Number(comment['0']),
                salary: ethers.formatUnits(comment['1'], 0),
                createTime: new Date(Number(comment['2']) * 1000),
                name: comment['3'],
                description: comment['4'],
                creator: comment['5'],
                status: ethers.formatUnits(comment['6'], 0),
                votes: votes
            }
            setCompanyDetail(tempResult)
            setDetailOpen(true);
        }

    };
    const handleDetailClose = () => {
        setDetailOpen(false);
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
        handleClose(setDigOpen);
        setIsLoading(false)
        setCompanyName('')
        setCompanyDescription('')
        setUserSalary(0)
        getCompanyList().then((x: any) =>
        {
            setSelectedCompany(companyName)
            getCompanyByComapany(companyName)
        })
    }

    const addonTicket = async (ehterAmount: number) =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const transContractInstance = new ethers.Contract(transTokenAddress, transTokenABI, signer)

        try
        {
            const transaction = await transContractInstance.addOnTickets(ethers.parseEther(ehterAmount.toString()))
            const transactionReceipt = await transaction.wait();
            if (transactionReceipt.status !== 1)
            {
                alert('error message');
                return;
            }
        }
        catch (e:any)
        {
            alert(e.message.split('(action')[0])
        }
        handleClose(setAddonTicketOpen);
        setIsLoading(false)
        setAddonValue(0)
        getBalance()
    } 

    const depositEth = async (ehterAmount: number) =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const transContractInstance = new ethers.Contract(transTokenAddress, transTokenABI, signer)
        const transaction = await transContractInstance.deposit({value: ethers.parseEther(ehterAmount.toString())})
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
            alert('error message');
        return;
        }
        handleClose(setDepositOpen);
        setIsLoading(false)
        setDepositTokenAmount(0)
        getBalance()
    }    

    const getBalance = async () => 
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const tokenInstance = new ethers.Contract(transTokenAddress, transTokenABI, signer)
        const balance = await tokenInstance.balanceOf(loginUser)
        const vote = await tokenInstance.getCurrentVotes(loginUser);
        setBalance(Number(ethers.formatUnits(balance, 18)))
        setTotalVotes(Number(ethers.formatUnits(vote, 18)))
    }

    const getCompanyList = async () =>
    {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        const result = await commentContractInstance.getCompanyList();
        if (result.length > 0)
        {
            setCompanyList(result)
            const resultv2 = await commentContractInstance.getCommentsByCompany(result[0]);
            const commentList:any = resultv2.map((comment: any) =>
            {
                const tempResult = {
                    id: Number(comment['0']),
                    salary: ethers.formatUnits(comment['1'], 0),
                    createTime: new Date(Number(comment['2']) * 1000),
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
                createTime: new Date(Number(comment['2']) * 1000),
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

    const commentVotes = async (id: number, name: string, vote: number, amount: number) =>
    { 
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const commentContractInstance = new ethers.Contract(commentProxyAddress, commentAbi, signer)
        try
        {
            const transaction = await commentContractInstance.vote(id, name, vote, amount)
            const transactionReceipt = await transaction.wait();
            if (transactionReceipt.status !== 1) {
                alert('error message');
            return;
            }
            setIsLoading(false)
            setVotes(0)
            setDetailOpen(false)
            
        }
        catch (e:any)
        {
            alert(e.message.split('(action')[0])
            setIsLoading(false)
            setVotes(0)
            setDetailOpen(false)
        }

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

    useEffect(() =>
    {
        if (!_.isEmpty((window as any).ethereum) && loginUser !== '')
        {
            const init = async () =>
            {
                await getBalance();
            }
            init()
        }
    }, [loginUser])
    
    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' className={classes.main}>
            <Grid container alignContent='flex-start' className={classes.mainContainer} >
                <Grid item container justifyContent='space-between'>
                    <Grid item>
                        <Button variant='contained' style={{backgroundColor:'#98a1c0'}} onClick={()=> handleClickOpen(setDigOpen)}>
                            <Typography style={{color: '#FFF'}}>
                                {"Create Comments"}
                            </Typography>
                        </Button>
                        <Dialog open={digOpen} onClose={() => handleClose(setDigOpen)}>
                            <DialogTitle>Create Comment</DialogTitle>
                                <LoadingOverlay
                                    active={isLoading}
                                    spinner
                                    text='Creating Comment...'
                                >
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
                                    <Button onClick={() => handleClose(setDigOpen)}>Cancel</Button>
                                    <Button onClick={() => { setIsLoading(true); createComments(companyName, companyDescription, userSalary); }}>Create</Button>
                                </DialogActions>
                            </LoadingOverlay>
                        </Dialog>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' style={{backgroundColor:'#98a1c0'}} onClick={()=> handleClickOpen(setDepositOpen)}>
                            <Typography style={{color: '#FFF'}}>
                                {"Deposit Token"}
                            </Typography>
                        </Button>
                        <Dialog open={depositOpen} onClose={() => handleClose(setDepositOpen)}>
                            <DialogTitle>Deposit Token</DialogTitle>
                                <LoadingOverlay
                                    active={isLoading}
                                    spinner
                                    text='Deposit...'
                                >
                                <DialogContent>
                                    <DialogContentText>
                                        Please input the amount of eth for deposing trans token.
                                    </DialogContentText>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="ETH"
                                        type="number"
                                        value={depositTokenAmount}
                                        onChange={(event)=> setDepositTokenAmount(parseFloat(event.target.value))}
                                        fullWidth
                                        variant="standard"
                                    />
                                 </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => handleClose(setDepositOpen)}>Cancel</Button>
                                    <Button onClick={() => { setIsLoading(true); depositEth(depositTokenAmount); }}>Deposit</Button>
                                </DialogActions>
                            </LoadingOverlay>
                        </Dialog>
                    </Grid>
                    <Grid item>
                        <Button variant='contained' style={{backgroundColor:'#98a1c0'}} onClick={()=> handleClickOpen(setAddonTicketOpen)}>
                            <Typography style={{color: '#FFF'}}>
                                {"Add-on ticket"}
                            </Typography>
                        </Button>
                        <Dialog open={addonTikectOpen} onClose={() => handleClose(setAddonTicketOpen)}>
                            <DialogTitle>Add-on Ticket</DialogTitle>
                                <LoadingOverlay
                                    active={isLoading}
                                    spinner
                                    text='Deposit...'
                                >
                                <DialogContent>
                                    <DialogContentText>
                                        Please input the amount of token to reveive the vote.
                                    </DialogContentText>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="Trans Token"
                                        type="number"
                                        value={addonValue}
                                        onChange={(event)=> setAddonValue(parseFloat(event.target.value))}
                                        fullWidth
                                        variant="standard"
                                    />
                                 </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => handleClose(setAddonTicketOpen)}>Cancel</Button>
                                    <Button onClick={() => { setIsLoading(true); addonTicket(addonValue); }}>Swap Vote</Button>
                                </DialogActions>
                            </LoadingOverlay>
                        </Dialog>
                    </Grid>
                </Grid>
                <Grid item container style={{marginTop:'10px', marginBottom:'10px'}}>
                    <Grid item style={{marginRight:'10px'}}>
                        <Chip label={`Current Token: ${balance}`} color="primary" variant="outlined" />
                    </Grid>
                    <Grid item>
                        <Chip label={`Current Votes: ${ethers.parseEther(totalVotes.toString())}`} color="success" variant="outlined" />
                    </Grid>
                </Grid>
                <Grid item container alignContent='center'>
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
                <Grid item container justifyContent='space-between' alignContent='center' >
                    <Grid item>
                         <Typography className={classes.loginWord}>
                            {"Comments"}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item container direction='column' style={{ width: '100%', marginTop:'20px'}} >
                    {
                        commentListByCompany.map((comment: any) =>
                        {
                            return (
                                <Grid item key={comment.id} style={{ width: '100%', height:'200px' }}>
                                    <Card key={comment.id} >
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
                                        <Grid item container justifyContent='flex-end'>
                                            <Grid item>
                                                <CardActions>
                                                    <Button style={{ backgroundColor: '#98a1c0' }} size="small" onClick={()=> handleDetailClickOpen(comment.id, comment.name)}>
                                                        <Typography style={{color:'#FFF'}}>
                                                            {'Detail'}
                                                        </Typography>
                                                    </Button>
                                                        {
                                                            companyDetail?.id === comment.id ?
                                                                <Dialog open={detailOpen} onClose={handleDetailClose}>
                                                            <Grid container justifyContent='space-between'>
                                                                <DialogTitle>Comment Details</DialogTitle>
                                                            </Grid>
                                                            <LoadingOverlay
                                                                    active={isLoading}
                                                                    spinner
                                                                    text='Voting...'
                                                            >
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        {`Company Name: ${companyDetail?.name}`}
                                                                    </DialogContentText>
                                                                    <DialogContentText>
                                                                        {`Company Description: ${companyDetail?.description}`}
                                                                    </DialogContentText>
                                                                    <DialogContentText>
                                                                        {`Company Salary: ${companyDetail?.salary}`}
                                                                    </DialogContentText>
                                                                    <DialogContentText>
                                                                        {`Creator: ${companyDetail?.creator}`}
                                                                    </DialogContentText>
                                                                    <DialogContentText>
                                                                        {`Agree: ${companyDetail?.votes?.agree}`}
                                                                    </DialogContentText>
                                                                    <DialogContentText>
                                                                        {`Against: ${companyDetail?.votes?.against}`}
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Typography style={{marginRight:'10px'}}>
                                                                        {'Vote'}
                                                                    </Typography>
                                                                    <TextField
                                                                        margin="dense"
                                                                        id="name"
                                                                        type="number"
                                                                        value={votes}
                                                                        onChange={(event)=> setVotes(parseFloat(event.target.value))}
                                                                        fullWidth
                                                                        variant="standard"
                                                                        style={{width:'140px'}}
                                                                    />
                                                                    <Button onClick={() => { setIsLoading(true); commentVotes(companyDetail?.id, companyDetail?.name, 1, votes) }}>Agree</Button>
                                                                    <Button onClick={() => { setIsLoading(true); commentVotes(companyDetail?.id, companyDetail?.name, 0, votes) }}>Against</Button>
                                                                </DialogActions>
                                                            </LoadingOverlay>
                                                        </Dialog>: ""
                                                        }
                                                        
                                                </CardActions>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </Grid>

    )
}

export default CompanyPage