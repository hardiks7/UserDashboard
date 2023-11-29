import React,{useState} from 'react'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LanguageIcon from '@mui/icons-material/Language';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Link, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';

const ListItems = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState('');
  const handaleButtonClick = (page) => {
    setActivePage(page);
  }

  
  return (
    <React.Fragment>
        <ListItemButton id='btn1' component={Link} to="/country" onClick={() => handaleButtonClick('country')}
        className={location.pathname === '/country' ? 'active' : ''}>
          <ListItemIcon>

            <LanguageIcon />
            
          </ListItemIcon>
          <ListItemText primary="Country" />
        </ListItemButton>
      <ListItemButton id='btn1' component={Link} to="/state" onClick={() => handaleButtonClick('state')} 
      className={location.pathname === '/state' ? 'active' : ''}>  
        <ListItemIcon>

          <MyLocationOutlinedIcon />

        </ListItemIcon>
        <ListItemText primary="State" />
      </ListItemButton>
      <ListItemButton id='btn1' component={Link} to="/city" onClick={() => handaleButtonClick('city')} 
         className={location.pathname === '/city' ? 'active' : ''}>
        <ListItemIcon>

            <LocationCityIcon />

        </ListItemIcon>
        <ListItemText primary="City" />
      </ListItemButton>
      <ListItemButton id='btn1' component={Link} to="/user" onClick={() => handaleButtonClick('user')} 
         className={location.pathname === '/user' ? 'active' : ''}>
        <ListItemIcon>

          <GroupIcon />

        </ListItemIcon>
        <ListItemText primary="User" />
      </ListItemButton>
    </React.Fragment>
    
  )
}

export default ListItems