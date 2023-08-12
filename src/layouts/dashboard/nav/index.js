import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
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
  const handleDonorRequest = async () => {
    try {
      // if (donorRequestData.blood_group === '') {
      //   toast.warn('Blood Group field cannot be empty ');
      // } else {
      const { data } = await axios.post(
        `${url}/donor/apply/`,
        { user_id: userId, blood_group: donorRequestData.blood_group },
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
        {!user?.is_donor && (
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

            <Button variant="contained" onClick={handleDonorRequest}>
              Apply to Be a Donor!
            </Button>
          </Stack>
        )}
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
