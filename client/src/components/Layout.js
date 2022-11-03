import { Outlet, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logOut, resetNotifications } from '../features/userSlice';
import { getCart } from '../features/cartSlice';
import { resetStore } from '../app/store';
import { getInitials } from '../helpers';
import Image from '../components/Image';
import httpService from '../helpers/axios';

const Layout = () => {
  // To know the height of Navbar
  const elementRef = useRef(null);
  const navbarHeight = elementRef?.current?.clientHeight;
  // Notifications
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});

  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // neccessery if want a single render in useEffect hook
  const cartOwner = user?.id;
  useEffect(() => {
    dispatch(getCart({ userId: cartOwner }));
  }, [dispatch, cartOwner]);

  const handleLogout = () => {
    dispatch(logOut())
      .unwrap()
      .then(() => {
        setTimeout(() => toast.success('Logout success'), 1000);
        navigate('/login');
        resetStore();
      })
      .catch(() => {
        !user && toast.error('Please login');
      });
  };

  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status === 'unread') return acc + 1;
    return acc;
  }, 0);

  function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display =
      notificationRef.current.style.display === 'block' ? 'none' : 'block';
    dispatch(resetNotifications());
    if (unreadNotifications > 0)
      httpService.post(`/api/v1/auth/${user.id}/updateNotifications`);
  }

  return (
    <>
      <header>
        {/* <div className="header-top bg-warning text-white">
        <Container fluid>
          <div>Hello</div>
        </Container>
      </div> */}

        <Navbar bg="light" expand="lg" fixed="top" ref={elementRef}>
          <Container fluid>
            <Navbar.Brand as={NavLink} to="/">
              <Image
                altText="logo"
                source="https://react-bootstrap.github.io/logo.svg"
                width="30"
                height="30"
                className="d-inline-block align-top mr-02"
              />
              Ecomern
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ml-auto">
                {!user && (
                  <Nav.Link
                    as={NavLink}
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? 'active' : 'inactive'
                    }
                  >
                    Login
                  </Nav.Link>
                )}
                {user && user.role !== 'admin' && (
                  <Nav.Link
                    as={NavLink}
                    to="/cart"
                    className={({ isActive }) =>
                      isActive ? 'active' : 'inactive'
                    }
                  >
                    <i className="fas fa-shopping-cart"></i>

                    {cart?.products?.length > 0 && (
                      <span className="badge badge-warning" id="cartcount">
                        {cart?.products?.length}
                      </span>
                    )}
                  </Nav.Link>
                )}
                {user && (
                  <>
                    <Nav.Link
                      style={{ position: 'relative' }}
                      onClick={handleToggleNotifications}
                    >
                      <i
                        className="fas fa-bell"
                        ref={bellRef}
                        data-count={unreadNotifications || null}
                      ></i>
                    </Nav.Link>
                    <span className="avatar bg-primary">
                      {user?.avatar ? (
                        <Image
                          source={user.avatar}
                          altText={`${user.name} avatar image`}
                          className="image-rounded"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </span>
                    <NavDropdown
                      title={user?.email}
                      id="collasible-nav-dropdown"
                    >
                      {user && (
                        <NavDropdown.Item
                          as={NavLink}
                          to="/profile"
                          className={({ isActive }) =>
                            isActive ? 'active' : 'inactive'
                          }
                        >
                          profile
                        </NavDropdown.Item>
                      )}
                      {user?.role === 'admin' && (
                        <NavDropdown.Item
                          as={NavLink}
                          to="/product"
                          className={({ isActive }) =>
                            isActive ? 'active' : 'inactive'
                          }
                        >
                          Product
                        </NavDropdown.Item>
                      )}
                      {user?.role === 'user' && (
                        <NavDropdown.Item
                          as={NavLink}
                          to="/completion"
                          className={({ isActive }) =>
                            isActive ? 'active' : 'inactive'
                          }
                        >
                          My orders
                        </NavDropdown.Item>
                      )}
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#action/3.4">
                        Separated link
                      </NavDropdown.Item>
                      <NavDropdown.Divider />

                      <Button
                        variant="danger"
                        onClick={handleLogout}
                        className="logout-btn"
                      >
                        Logout
                      </Button>
                    </NavDropdown>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
          {/* notifications */}
          <div
            className="notifications-container"
            ref={notificationRef}
            style={{
              position: 'absolute',
              top: bellPos.top + 30,
              left: bellPos.left,
              display: 'none',
            }}
          >
            {user?.notifications.length > 0 ? (
              user?.notifications.map((notification, index) => (
                <p
                  className={`notification-${notification.status}`}
                  key={index}
                >
                  {notification.message}
                  <br />
                  <span>
                    {notification.time.split('T')[0] +
                      ' ' +
                      notification.time.split('T')[1]}
                  </span>
                </p>
              ))
            ) : (
              <p>No notifcations yet</p>
            )}
          </div>
        </Navbar>
      </header>
      <main className="main" style={{ marginTop: navbarHeight }}>
        <Container fluid>
          <Outlet />
        </Container>
      </main>
      <footer>Footer</footer>
    </>
  );
};

export default Layout;
