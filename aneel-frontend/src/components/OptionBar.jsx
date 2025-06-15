import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom';

function OptionBar() {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand 
            style={{ marginLeft: 0, paddingLeft: 0 }}
            as={NavLink}
            to="/">Pequenos Distribuidores
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link> 
            <Nav.Link as={NavLink} to="/national">Nacional</Nav.Link>
            <Nav.Link as={NavLink} to="/regional">Regional</Nav.Link>
            <Nav.Link as={NavLink} to="/trends">Tendências</Nav.Link>
            <Nav.Link as={NavLink} to="/modalities">Modalidades</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default OptionBar;