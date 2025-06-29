import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import './optionBarStyle.css';

function OptionBar() {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg" sticky="top" className="custom-navbar">
      <Container fluid>  {/* Alterado para fluid */}
        <Navbar.Brand 
          style={{ marginLeft: 0, paddingLeft: 0 }}
          as={NavLink}
          to="/"
        >
          Pequenos Geradores
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">  {/* Adicionado className */}
          <Nav>
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link> 
            <Nav.Link as={NavLink} to="/national">Nacional</Nav.Link>
            <Nav.Link as={NavLink} to="/regional">Regional</Nav.Link>
            <Nav.Link as={NavLink} to="/trends">Tendências</Nav.Link>
            <Nav.Link as={NavLink} to="/modalities">Modalidades</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        
        {/* Espaço vazio para balancear o layout */}
        <div style={{ width: 'calc(100px)' }}></div>
      </Container>
    </Navbar>
  );
}

export default OptionBar;