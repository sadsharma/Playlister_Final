import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import MailIcon from '@mui/icons-material/Mail';
import BungalowIcon from '@mui/icons-material/Bungalow';
import Groups2Icon from '@mui/icons-material/Groups2';
import Person4Icon from '@mui/icons-material/Person4';
import SortIcon from '@mui/icons-material/Sort';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    let isLogoutMenuOpen = false;
    let isSortMenuOpen = false;

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        store.closeCurrentList();
        auth.logoutUser();
    }

    const handleHomeButton = () => {
        store.handleHomeButtonClick();
    }

    function handleSearchByPlaylistButton () {
        console.log("hihi");
        store.handleSearchByPlaylistButtonClick();
    }

    const handleSearchByUserButton = () => {
        store.handleSearchByUserButtonClick();
    }
    const handleSortByName = () => {
        store.sortByName();
    }
    const handleSortByListens = () => {
        store.sortByListens();
    }
    const handleSortByPublishedDate = () => {
        store.sortByPublishedDate();
    }
    const handleSortByLikes = () => {
        store.sortByLikes();
    }
    const handleSortByDislikes = () => {
        store.sortByDislikes();
    }

    const handleOnKeyDown = (e) => {
        if(e.key === "Enter")
        {
            if(store.currentView === "SEARCH-BY-PLAYLIST-SCREEN")
            {
                store.retrieveAllPlaylists(e.target.value);
            }
            if(store.currentView === "SEARCH-BY-USER-SCREEN")
            {
                store.retrieveAllPlaylistsByUser(e.target.value);
            }
            if(store.currentView === "HOME-SCREEN")
            {
                store.filterSongsHomeScreen(e.target.value);
            }
        }
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={anchorEl !== null && anchorEl.id === "logout"}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>  )      
    const sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={anchorEl !== null && anchorEl.id === "sort"}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleSortByName}>Sort by Name</MenuItem>
            <MenuItem onClick={handleSortByPublishedDate}>Sort by Published Date</MenuItem>
            <MenuItem onClick={handleSortByLikes}>Sort by Likes</MenuItem>
            <MenuItem onClick={handleSortByDislikes}>Sort by Dislikes</MenuItem>
            <MenuItem onClick={handleSortByListens}>Sort by Listens</MenuItem>
        </Menu>   )    

    let editToolbar = "";
    let menu = loggedOutMenu;
    if(store.guestAccountCheck)
    {
        menu = null;
    }
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
            editToolbar = <EditToolbar />;
        }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if(store.guestAccountCheck)
        {
            return <a href='/'><button>SPLASH SCREEN</button></a>
        }
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '68ch',
          },
        },
      }));

      const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      }));

    let colorOfHomeButton = 'black';
    if(store.currentView === "HOME-SCREEN" && !store.guestAccountCheck)
    {
        colorOfHomeButton = 'red';
    }
    let colorOfSearchByPlaylistButton = 'black';
    if(store.currentView === "SEARCH-BY-PLAYLIST-SCREEN")
    {
        colorOfSearchByPlaylistButton = 'red';
    }
    let colorOfSearchByUserButton = 'black';
    if(store.currentView === "SEARCH-BY-USER-SCREEN")
    {
        console.log("gets here?");
        colorOfSearchByUserButton = 'red';
    }
    console.log(colorOfSearchByPlaylistButton);
    if((auth.loggedIn  || store.guestAccountCheck) && !auth.onlyRegistered)
    {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: '#a7c7e7' }}>
                    <Toolbar>
                        <Typography                        
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}                        
                        >
                            <Link style={{ textDecoration: 'none', color: 'white' }} to='/'><div id="playlister-Logo">
                PLAYLISTER
                </div></Link>
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton
                                id="logout"
                                style={{ textDecoration: 'none', color: 'black' }}
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                { getAccountMenu(auth.loggedIn) }
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {
                    menu
                }
                <AppBar position="static" style={{ background: '#a7b8e3'}}>
                    <Toolbar id="Secondary-toolbar">
                    <IconButton style={{ textDecoration: 'none', color: 'black' }} disabled={store.guestAccountCheck} onClick={handleHomeButton}>
                        <BungalowIcon
                            size="large"
                            edge="start"
                            color={colorOfHomeButton}
                            aria-label="open drawer"
                            sx={{ mr: 2, color: colorOfHomeButton}}
                        >
                        </BungalowIcon> 
                    </IconButton>
                    <Box sx={{ flexGrow: .02}}></Box>
                    <Groups2Icon
                        style={{ textDecoration: 'none'}}
                        size="large"
                        edge="start"
                        aria-label="open drawer"
                        sx={{ mr: 2, color: colorOfSearchByPlaylistButton}}
                        onClick={handleSearchByPlaylistButton}
                    >
                        <MenuIcon />
                    </Groups2Icon>
                    <Box sx={{ flexGrow: .02}}></Box>
                    <Person4Icon
                        style={{ textDecoration: 'none'}}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2, color: colorOfSearchByUserButton}}
                        onClick={handleSearchByUserButton}
                    >
                        <MenuIcon />
                    </Person4Icon>
                    <Box sx={{ flexGrow: .40 }}></Box>
                    <Search style={{ textDecoration: 'none', color: 'black' }}>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onKeyDown={handleOnKeyDown}
                        />
                    </Search>
                    <Box sx={{ flexGrow: .50 }}></Box>
                    <SortIcon
                        id="sort"
                        style={{ textDecoration: 'none', color: 'black' }}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={handleSortMenuOpen}
                    >
                        <MenuIcon />
                    </SortIcon>
                    
                    </Toolbar>
                </AppBar>
                {
                    sortMenu
                }
            </Box>
        );
    }   
    else{
        return null;
    }
}