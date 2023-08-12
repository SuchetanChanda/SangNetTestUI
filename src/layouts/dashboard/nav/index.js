import PropTypes from 'prop-types';
import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
} from '@mui/material';
// mock
import axios from 'axios';
import { toast } from 'react-toastify';
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import { useAuthContext } from '../../../hooks/useAuthContext';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { pathname } = useLocation();
  const { user, dispatch } = useAuthContext();
  const [donorData, setDonorData] = useState([]);
  const [donorBloodGroupData, setDonorBloodGroupData] = useState([]);
  const [lastDonated, setLastDonated] = useState([]);
  const [donorRequestData, setDonorRequestData] = useState({
    blood_group: '',
    last_donated: '',
  });

  const isDesktop = useResponsive('up', 'lg');

  const url = `http://localhost:8000`;
  const token = localStorage.getItem('access');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const [age, setAge] = useState('');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const handleChange = (event) => {
    setDonorBloodGroupData(event.target.value);
  };

  const handleDonorRequest = async () => {
    try {
      // if (donorRequestData.blood_group === '') {
      //   toast.warn('Blood Group field cannot be empty ');
      // } else {
      const { data } = await axios.post(
        `${url}/donor/apply/`,
        { user_id: userId, blood_group: donorBloodGroupData },
        {
          headers: { ' Content-Type': 'application/json' },
        }
      );
      dispatch({
        type: 'UPDATE',
        payload: 'AP',
      });
      setDonorData(data);
      handleClose();
      // console.log(data);
      toast.success('Request submitted successfully');
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {`${user?.first_name} ${user?.last_name}`}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        {!user?.donor_application_status === 'VR' ||
          (!user?.donor_application_status === 'AP' && (
            <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
              <Box
                component="img"
                src="/assets/illustrations/illustration_avatar.png"
                sx={{ width: 100, position: 'absolute', top: -50 }}
              />
              <Box sx={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h6">
                  Want to Be a Donor?
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  You are just one click away!
                </Typography>
              </Box>
              {/* <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Group"
                onChange={handleChange}
              >
                <MenuItem value={10}>A+</MenuItem>
                <MenuItem value={20}>A-</MenuItem>
                <MenuItem value={30}>B+</MenuItem>
                <MenuItem value={30}>B-</MenuItem>
                <MenuItem value={30}>AB+</MenuItem>
                <MenuItem value={30}>O+</MenuItem>
                <MenuItem value={30}>O-</MenuItem>
              </Select>
            </FormControl> */}

              <Button variant="contained" onClick={handleOpen}>
                Apply to Be a Donor!
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Apply for Donor
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Group</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={donorBloodGroupData}
                        label="Group"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>A+</MenuItem>
                        <MenuItem value={20}>A-</MenuItem>
                        <MenuItem value={30}>B+</MenuItem>
                        <MenuItem value={40}>B-</MenuItem>
                        <MenuItem value={50}>AB+</MenuItem>
                        <MenuItem value={60}>O+</MenuItem>
                        <MenuItem value={70}>O-</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      sx={{ justifyContent: 'center', alignItems: 'center', padding: '14px' }}
                      onClick={handleDonorRequest}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Stack>
          ))}
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
