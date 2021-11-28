import React from 'react'

import { Navbar, Nav, } from 'react-bootstrap'
import useToken from './useToken';

export default function BootstrapNavbar() {
    const [token, setToken] = useToken();
    return (
        <>
            <Navbar bg="info" variant="light" expand="lg" sticky="top">
                <Navbar.Brand href="#home">Tripal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav.Link href="/mapview">Mapview</Nav.Link>
                <Nav.Link href="/search_restaurant">Restaurant</Nav.Link>
                <Navbar.Collapse>

                    <Nav className="justify-content-end" style={{ width: "100%" }}>
                        {token && (<Navbar.Text>
                            Signed in as: <a href="#login">{token.username}</a>
                        </Navbar.Text>)}
                        {!token && (
                            <>
                        <Nav.Link href="/login">Log In</Nav.Link>
                        <Nav.Link href="/signup">Sign Up</Nav.Link>
                        </>
                        )}

                    </Nav>
                </Navbar.Collapse>

            </Navbar>

        </>
    )
}