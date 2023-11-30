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
import AddIcon from '@mui/icons-material/Add';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
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
  }),
);

const defaultTheme = createTheme();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const User = () => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleBack = () => {
    navigate('/dashboard')
  };


  
  const [dialog, setDialog] = useState(false)
  const [dialogtitle, setDialogtitle] = useState('Add City')
  const [viewDialog, setViewDialog] = useState(false)
  const [isdisabled, setIsDisabled] = useState(true)
  const [cityid, setCityId] = useState("")
  const [state, setState] = useState([])
  const [country, setCountry] = useState([])
  const [selectedCountryId, setselectedCountryId] = useState("")
  const [selectedStateId, setselectedStateId] = useState("")

  const [userdata, setUserdata] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalrecord, setTotalRecord] = useState('')
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [userId, setUserID] = useState("")
  const [firstname, setFirstName] = useState("")
  const [LastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phonenumber, setPhoneNumber] = useState("")
  const [profilepicture, setProfilePicture] = useState("")
  const [resume, setResume] = useState("")
  const [address, setAddress] = useState("")
  const [countryname, setCountryName] = useState("")
  const [statename, setStateName] = useState("")
  const [cityname, setCityName] = useState("")
  const [imageDiloge, setImageDialog] = useState(false)
  
  const count = parseInt(totalrecord);


  useEffect(() => {
    if (selectedCountryId === '' || selectedStateId === '' || cityname === '') {
      setIsDisabled(true)
    }
    else {
      setIsDisabled(false)
    }
  }, [selectedCountryId, selectedStateId, cityname])


  const handleAdd = (mode) => {
    setDialogtitle(mode === 'add' ? 'Add City' : 'Edit City')
    setDialog(true);
    handleClear()
  };

  const handleClear = () => {
    setselectedCountryId("");
    setselectedStateId("");
    setCityName("");
  }

  const handleClose = () => {
    setDialog(false);
    setViewDialog(false)
    setDeleteDialog(false)
  };

  const handleEdit = (mode, city) => {
    setDialogtitle(mode === 'edit' ? 'Edit City' : 'Add City')
    setDialog(true);
    setCityName(city.cityname);
    const countryId = findcountryId(city.countryname)
    setselectedCountryId(countryId);
    const stateId = findstateId(city.statename)
    setselectedStateId(stateId);
    setCityId(city.cityid);
  };

  const findcountryId = (selectedCountryName) => {
    const selectedcountry = country.find((c) => c.countryname === selectedCountryName)
    if (selectedcountry) {
      return selectedcountry.countryid
    }
    return "";
  };


  const findstateId = (selectedStateName) => {
    const selectedstate = state.find((state) => state.statename === selectedStateName)
    if (selectedstate) {
      return selectedstate.stateid
    }
    return "";
  }


  const handleView = (city) => {
    setViewDialog(true);
    setCountryName(city.countryname);
    setStateName(city.statename);
    setCityName(city.cityname);
  }

  const handleDelete = (city) => {
    setDeleteDialog(true);
    setCityId(city.cityid);
  }

  const getCountry = async () => {
    const response = await fetch('http://localhost:4500/country')
    const data = await response.json();
    setCountry(data)
  }


  const getState = async () => {
    const response = await fetch('http://localhost:4500/state')
    const data = await response.json();
    setState(data)
  }

  


  // insert in new City 

  const getCountryName = (countryId) => {
    const selectedcountry = country.find((c) => c.countryid === countryId);
    return selectedcountry ? selectedcountry.countryname : "";
  }

  const getStateName = (stateId) => {
    const selectedstate = state.find((state) => state.stateid === stateId);
    return selectedstate ? selectedstate.statename : "";
  }

  const createCity = async () => {
    try {
      const CountryName = getCountryName(selectedCountryId)
      const StateName = getStateName(selectedStateId)
      const newCity = {
        selectedCountryId,
        countryname: CountryName,
        selectedStateId,
        statename: StateName,
        cityname
      };
      const response = await fetch("http://localhost:4500/city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      if (response.ok) {
        const data = await response.json();
        newCity.cityid = data.cityid;
        setCity([...city, newCity]);
        toast.success("city Added SuccessFully");
      }
      else {
        toast.error("city Already Exists!");
      }
    } catch (error) {
      console.error("NetWork Error:", error)
    }
  }


  // Delete city

  const handleDeleteConfirm = (cityid) => {
    fetch(`http://localhost:4500/city/${cityid}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setDeleteDialog(false);
          getCity(page, rowsPerPage);
          toast.success("Delete SuccessFully");
        }
        else {
          console.error('Failed to mark City as Deleted')
        }
      })
      .catch((error) => {
        console.error("NetWork Error:", error)
        toast.error("Failed to mark City as Deleted");
      })

  }

  const handelsubmit = async (e) => {
    e.preventDefault();
    if (selectedCountryId.length > 50) {
      toast.error('countryName should be less then 50')
    }
    else if (selectedStateId.length > 50) {
      toast.error('statename should be less then 50')
    }
    else if (cityname.length > 50) {
      toast.error('cityname should be less then 50')
    }
    else {
      try {
        await createCity()
        setDialog(false)
      } catch (error) {
        console.error("NetWork Error:", error);
        toast.error("Faile To Add State")
      }

    }
  }

  // Update City

  const handleupdate = (e, cityid) => {
    e.preventDefault();
    fetch(`http://localhost:4500/city/${cityid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedCountryId, selectedStateId, cityname }),
    })
      .then((response) => {
        if (response.ok) {
          setDialog(false)
          toast.success('City update successfuly')
          getCity(page, rowsPerPage);
        }
      })
      .catch(() => {
        toast.error('Faile To City update ... ')
      })
  }

  // Pagination

  const getUserData = useCallback(async (pages, rowsPerPage) => {
    const response = await fetch(`http://localhost:4500/UserPagination?pageNumber=${pages + 1}&pageSize=${rowsPerPage}&filter=${search}&sortOrder=${sortOrder}`)
    const data = await response.json();
    setUserdata(data.data)
    setTotalRecord(data.total)
  }, [search, sortOrder])


  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate('/')
    } else {
      getUser(0, rowsPerPage);
      getCountry()
      getState()
    }
  }, [getUser])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getUser(newPage, rowsPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    const newPageCount = Math.ceil(count / newRowsPerPage);
    const newLastPage = Math.max(0, newPageCount - 1);

    const currentPage = Math.min(page, newLastPage);
    setRowsPerPage(newRowsPerPage);

    if (page === newLastPage) {
      getUser(currentPage, newRowsPerPage);
      setPage(currentPage);
    } else {
      getUser(0, newRowsPerPage);
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
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h5"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                User Page
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
              }}
            >
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
            <Box component="main" sx={{position: 'relative',top:'38px'}}>
              {/* searchbar.. */}
              <Paper
                component="form"
                sx={{ p: '2px 15px',
                display: 'flex',
                alignItems: 'center',
                width: 350,
                marginLeft: '9rem', 
                marginTop: '2rem',
                borderBottom: '2.5px solid orange',
                borderRight: '1px solid orange' }}
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
              backgroundColor:'white',
              color: 'grey',
              position:'absolute',
              top:'42%',
              right:'9rem',
              width:'6rem',
              cursor:'pointer',
              border:'1px solid',
              paddingBottom:'1px',
              fontSize:'20px',
              borderRadius:'5px'
            }}
                onClick={() => handleAdd('add')}> Add USer <AddIcon sx={{
                  paddingTop: '5px',
                  fontSize: '20px'
                }} />
              </button>
            </Box>

            <Dialog
              open={viewDialog}
              TransitionComponent={Transition}
              keepMounted
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle
                sx={{ textAlign: 'center' }}>{dialogtitle}
                <Button sx={{ border: '1px solid', position: 'absolute', right: '15px', color: 'black' }}
                  onClick={handleClose}> X </Button>
              </DialogTitle>
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1px",
                    width: "30rem",
                    fontFamily: "cursive",
                    fontSize: '20px'
                  }}
                >
                  <div style={{ paddingTop: "5px" }}>
                    <p>FirstName: <span>{firstname}</span></p>
                  </div>
                  <div>
                    <p>LastName: <span>{lastname}</span></p>
                  </div>
                  <div>
                    <p>E-Mail: <span>{email}</span></p>
                  </div>
                  <div>
                    <p>PhoneNumber: <span>{phonenumber}</span></p>
                  </div>
                  <div style={{marginTop: '1rem'}}>
                    <span>ProfilePicture: </span> <br /><img src={profilepicture}  width='70px'/>
                  </div>
                  <div>
                    <p>Resume: <span>{resume}</span></p>
                  </div>
                  <div>
                    <p>Address: <span>{address}</span></p>
                  </div>
                  <div>
                    <p>CountryName: <span>{countryname}</span></p>
                  </div>
                  <div>
                    <p>StateName: <span>{statename}</span></p>
                  </div>
                  <div>
                    <p>CityName: <span>{cityname}</span></p>
                  </div>
                </div>
              </DialogContent>
              </Dialog>
            <Dialog
              open={imageDialog}
              TransitionComponent={Transition}
              keepMounted
              aria-describedby="alert-dialog-slide-description"
              onClose={() => setImageDialog(false)}
            >
                <img src={profilepicture}  width='100%'/>
            </Dialog>
              {/* <DialogActions>
                {dialogtitle === 'Add City' ? (<Button disabled={isdisabled} onClick={(e) => handelsubmit(e)}>SUBMIT</Button>)
                  : (<Button disabled={isdisabled} onClick={(e) => handleupdate(e, cityid)}>Update</Button>)}
                <Button onClick={handleClear}>CANCEL</Button>
              </DialogActions> */}
            

            {/* <Dialog
              open={viewDialog}
              TransitionComponent={Transition}
              keepMounted
              // onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle sx={{ width: "400px" }}>View City<Button
                sx={{ border: '1px solid', position: 'absolute', right: '15px', color: 'black' }}
                onClick={handleClose}> X </Button>
              </DialogTitle>
              <DialogContent>
                <div>
                  <h3>Country Name</h3>
                  <p>{countryname}</p>
                  <h3>State Name</h3>
                  <p>{statename}</p>
                  <h3>City Name</h3>
                  <p>{cityname}</p>
                </div>
              </DialogContent>
            </Dialog> */}

            <Dialog
              open={deleteDialog}
              TransitionComponent={Transition}
              keepMounted
              // onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle sx={{ width: "400px" }}>Delete Confirmation</DialogTitle>
              <DialogContent>
                <h4> Are You Sure You Want To Delete This City</h4>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleDeleteConfirm(cityid)}> DELETE </Button>
                <Button onClick={handleClose}> CANCEL </Button>
              </DialogActions>
            </Dialog>

            <Box sx={{ m: '0 auto', mt: '4rem', width: '78%' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => handleSort()}>FirstName
                        {sortOrder === 'asc' ? (<KeyboardArrowUpIcon sx={{pt:"0.5rem"}} />) : (<KeyboardArrowDownIcon sx={{pt:"0.5rem"}} />)}
                      </TableCell>
                      <TableCell>LastName</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Profile Picture</TableCell>
                      <TableCell>Resume</TableCell>
                      <TableCell colSpan={4} align='center'>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userdata.map((data) => (
                      <TableRow
                        key={data.userid}
                        
                      >
                        <TableCell component= "th" scope="row" >{data.firstname}</TableCell>
                        <TableCell >{data.lastname}</TableCell>
                        <TableCell >{data.email}</TableCell>
                        <TableCell >{data.phonenumber}</TableCell>
                        <TableCell ><img src={data.profilepicture} width= '65px' height= '65px' /></TableCell>
                        <TableCell >{data.resume}</TableCell>
                        <TableCell><ModeEditOutlineIcon sx={{ color: '#3f533d' }} onClick={() => handleEdit('edit', city)} /></TableCell>
                        <TableCell><DeleteIcon sx={{ color: '#724560' }} onClick={() => { handleDelete(data) }}></DeleteIcon></TableCell>
                        <TableCell><RemoveRedEyeIcon sx={{ color: '#5c7262' }} onClick={() => { handleView(data.userid) }} /></TableCell>
                      </TableRow>
                    ))}
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
              rowsPerPageOptions={[3, 5, 10, 15]}
              sx={{ mt: '2rem', mr: '11.5rem' }}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  )
}

export default User