import React, { useState, useEffect, useCallback } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItems from './ListItems';
import Button from '@mui/material/Button';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-toastify/dist/ReactToastify.minimal.css";
import TablePagination from '@mui/material/TablePagination';
import InputBase from '@mui/material/InputBase';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Country = () => {

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleBack = () => {
    navigate('/dashboard')
  }

  const [country, setCountry] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [dialogtitle, setDialogtitle] = useState('Add Country')
  const [viewDialog, setViewDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [countryname, setCountryName] = useState("")
  const [countrycode, setCountryCode] = useState("")
  const [phonecode, setPhoneCode] = useState("")
  const [isdisabled, setIsDisabled] = useState(true);
  const [countryId, setCountryId] = useState("")
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalrecord, setTotalRecord] = useState('');
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc")

  const count = parseInt(totalrecord);

  useEffect(() => {
    if (countryname === '' || countrycode === '' || phonecode === '') {
      setIsDisabled(true)
    }
    else {
      setIsDisabled(false)
    }
  }, [countryname, countrycode, phonecode])

  const handleAdd = (mode) => {
    setDialogtitle(mode === 'add' ? 'Add Country' : 'Edit Country')
    setDialog(true);
    handleClear();
  };

  const handleClear = () => {
    setCountryName("");
    setCountryCode("");
    setPhoneCode("");
  }

  const handleClose = () => {
    setDialog(false);
    setViewDialog(false)
    setDeleteDialog(false)
  };

  const handleEdit = (mode, countries) => {
    setDialogtitle(mode === 'edit' ? 'Edit Country' : 'Add Country')
    setDialog(true);
    setCountryName(countries.countryname);
    setCountryCode(countries.countrycode);
    setPhoneCode(parseInt(countries.phonecode));
    setCountryId(countries.countryid);
  };

  const handleView = (countries) => {
    setViewDialog(true);
    setCountryName(countries.countryname);
    setCountryCode(countries.countrycode);
    setPhoneCode(parseInt(countries.phonecode));
  }

  const handleDelete = (countries) => {
    setDeleteDialog(true)
    setCountryId(countries.countryid)

  }


  // Insert in New Country 

  const createCountry = async () => {
    try {
      const newCountry = {
        countryname,
        countrycode,
        phonecode,
      };
      const response = await fetch("http://localhost:4500/country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCountry),
      });

      if (response.ok) {
        const data = await response.json();
        newCountry.countryid = data.countryid;
        setCountry([...country, newCountry]);
        toast.success("Country Added SuccessFully");
      }
      else {
        toast.error("Country Already Exists..!");
      }
    } catch (error) {
      console.error("NetWork Error:", error)
    }
  }

  // Delete Country

  const handleDeleteConfirm = (countryId) => {
    fetch(`http://localhost:4500/country/${countryId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDeleteDialog(false);
          getCountry(page, rowsPerPage);
          toast.success("Delete SuccessFully");
        }
        else {
          console.error('Failed to mark country as Deleted')
        }
      })
      .catch((error) => {
        console.error("NetWork Error:", error)
        toast.error("Failed to mark country as Deleted");
      })

  }

  const handelsubmit = async (e) => {
    e.preventDefault();
    if (countryname.length > 50) {
      toast.error('countryName should be less then 50')
    }
    else if (countrycode.length > 2) {
      toast.error('countrycode should be less then 2')
    }
    else if (phonecode.length > 4) {
      toast.error('phonecode should be less then 4')
    }
    else {
      try {
        await createCountry()
        setDialog(false)
      } catch (error) {
        console.error("NetWork Error:", error);
        toast.error("Faile To Add Country")
      }
    }
  };

  // Update Country

  const handleupdate = (e, countryid) => {
    e.preventDefault();
    fetch(`http://localhost:4500/country/${countryid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ countryname, countrycode, phonecode }),
    })
      .then((response) => {
        if (response.ok) {
          setDialog(false)
          toast.success('Country update successfuly')
          getCountry(page, rowsPerPage);
        }
      })
      .catch(() => {
        toast.error('Coutry update faile ... ')
      })
  }

  //pagination

  const getCountry = useCallback(async (pages, rowsPerPage) => {
    const response = await fetch(`http://localhost:4500/countryPagination?pageNumber=${pages + 1}&pageSize=${rowsPerPage}&filter=${search}&sortOrder=${sortOrder}`)
    const data = await response.json();
    console.log(data);
    setCountry(data.data)
    setTotalRecord(data.total)
  }, [search, sortOrder])

  // useEffect(() => {

  // }, [getCountry])

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate('/')
    } else {
      getCountry(0, rowsPerPage);
    }
  }, [getCountry])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getCountry(newPage, rowsPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    const newPageCount = Math.ceil(count / newRowsPerPage);
    const newLastPage = Math.max(0, newPageCount - 1);

    const currentPage = Math.min(page, newLastPage);
    setRowsPerPage(newRowsPerPage);

    if (page === newLastPage) {
      getCountry(currentPage, newRowsPerPage);
      setPage(currentPage);
    } else {
      getCountry(0, newRowsPerPage);
      setPage(0);
    }
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }



  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px',
                backgroundColor: 'black',
                color: 'grey',
                borderLeft: '6.5px solid orange',
              }}>

              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}>
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}>
                Country Page
              </Typography>

              <Button variant="contained"
                sx={{ backgroundColor: 'grey', color: 'black', border: '1.8px solid orange' }}
                onClick={handleBack}>
                Go To Dashboard
              </Button>

            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>

            <Divider />
            <List component="nav">
              <ListItems />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Box component="main" sx={{ position: 'relative', top: '38px' }}>
              {/* searchbar.. */}
              <Paper
                component="form"
                sx={{
                  p: '2px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  width: 350,
                  marginLeft: '16rem',
                  marginTop: '2rem',
                  borderBottom: '2.5px solid orange',
                  borderRight: '1px solid orange'
                }}
              >
                <InputBase
                  sx={{ ml: 0, flex: 1, height: '3rem' }}
                  placeholder="Search of City"
                  inputProps={{ 'aria-label': 'Search of City' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type='search'
                />
              </Paper>
              <button style={{
                backgroundColor: 'white',
                color: 'grey',
                position: 'absolute',
                top: '42%',
                right: '16rem',
                width: '6rem',
                cursor: 'pointer',
                border: '1px solid',
                paddingBottom: '1px',
                fontSize: '20px',
                borderRadius: '5px'
              }}
                onClick={() => handleAdd('add')}> Add <AddIcon sx={{
                  paddingTop: '5px',
                  fontSize: '20px'
                }} />
              </button>
            </Box>

            <Dialog
              open={dialog}
              TransitionComponent={Transition}
              keepMounted
              // onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle
                sx={{ textAlign: 'center' }}>{dialogtitle}
                <Button sx={{ border: '1px solid', position: 'absolute', right: '15px', color: 'black' }}
                  onClick={handleClose}> X </Button>
              </DialogTitle>
              <DialogContent>
                
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', gap: '20px', width: '30rem' }}>
                    <div style={{ paddingTop: '10px' }}>
                      <TextField label="CountryName" variant="outlined" id='countryname' name='countryname'
                        value={countryname} onChange={(e) => setCountryName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} fullWidth />
                    </div>
                    <div>
                      <TextField label="CountryCode" variant="outlined" fullWidth id='countrycode' name='countrycode'
                        value={countrycode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())} />
                    </div>
                    <div>
                      <TextField label="PhoneCode" variant="outlined" fullWidth id='phonecode' type='number' name='phonecode'
                        value={phonecode} onChange={(e) => setPhoneCode(e.target.value)} />
                    </div>
                  </div>
                
              </DialogContent>
              <DialogActions>
                {dialogtitle === 'Add Country' ? (<Button disabled={isdisabled} type='submit' variant='contained' onClick={(e) => handelsubmit(e)}>SUBMIT</Button>)
                  : (<Button disabled={isdisabled} onClick={(e) => handleupdate(e, countryId)}>Update</Button>)}
                <Button onClick={handleClear}>CANCEL</Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={viewDialog}
              TransitionComponent={Transition}
              keepMounted
              // onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle sx={{ width: "400px" }}>View Country<Button
                sx={{ border: '1px solid', position: 'absolute', right: '15px', color: 'black' }}
                onClick={handleClose}> X </Button>
              </DialogTitle>
              <DialogContent>
                <div>
                  <div>
                    <h3>Country Name</h3>
                    <p>{countryname}</p>
                  </div>
                  <div>
                    <h3>Country code</h3>
                    <p>{countrycode}</p>
                  </div>
                  <div>
                    <h3>PhoneCode</h3>
                    <p>{phonecode}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={deleteDialog}
              TransitionComponent={Transition}
              keepMounted
              // onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle sx={{ width: "400px" }}>Delete Confirmation</DialogTitle>
              <DialogContent>
                <h4> Are You Sure You Want To Delete This Country</h4>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleDeleteConfirm(countryId)} >DELETE</Button>

                <Button onClick={handleClose}>CANCEL</Button>
              </DialogActions>
            </Dialog>

            <Box sx={{ m: '0 auto', mt: '4rem', width: '70%' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell >CountryId</TableCell>
                      <TableCell onClick={() => handleSort()}>CountryName
                        {sortOrder === 'asc' ? (<KeyboardArrowUpIcon />) : (<KeyboardArrowDownIcon />)}
                      </TableCell>
                      <TableCell>CountryCode</TableCell>
                      <TableCell>PhoneCode</TableCell>
                      <TableCell colSpan={3} align='center'>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {country.length === 0 ? (
                      <TableRow>
                        <TableCell align='center' colSpan={5}>
                          <h5>No Record Found</h5>
                        </TableCell>
                      </TableRow>
                    ) : (
                      country.map((c) => (
                        <TableRow
                          key={c.countryid}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {c.countryid}
                          </TableCell>
                          <TableCell>{c.countryname}</TableCell>
                          <TableCell>{c.countrycode}</TableCell>
                          <TableCell>{c.phonecode}</TableCell>
                          <TableCell><ModeEditOutlineIcon sx={{ color: '#3f533d' }} onClick={() => handleEdit('edit', c)} /></TableCell>
                          <TableCell><DeleteIcon sx={{ color: '#724560' }} onClick={() => handleDelete(c)} /></TableCell>
                          <TableCell><RemoveRedEyeIcon sx={{ color: '#5c7262' }} onClick={() => { handleView(c) }} /></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <TablePagination
              component="div"
              count={count || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
              sx={{ mt: '2rem', mr: '16rem' }}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}
export default Country;