import React from 'react'
import Link from 'next/link'

const links = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/app', label: 'Try now!' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Nav = (props) => (
  <nav className="navbar navbar-light nav-light navbar-expand-md">
    <div className="container">
      <span className="navbar-brand">
        <Link href="/index">
          <a className="nav-link brand-title">Sure<b>Hired</b></a>
        </Link>
      </span>
      <button
        className="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbar2SupportedContent">
        <i className="fa fa-bars" style={{ color: "white" }} aria-hidden="true" />
      </button>
      <div
        className="collapse navbar-collapse text-center justify-content-end"
        id="navbar2SupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link href="/index">
              <a className="nav-link nav-link-white">HOME</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about">
              <a className="nav-link nav-link-white">ABOUT</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contact">
              <a className="nav-link nav-link-white">CONTACT</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/sign-up">
              <a className="nav-link nav-link-white">SIGN UP</a>
            </Link>
          </li>
          <li className="nav-item">
            {props.isLoggedIn ?
              <Link href="/app/dashboard">
                <a className="nav-link nav-link-white">DASHBOARD</a>
              </Link>
              : <Link href="/login">
                <a className="nav-link nav-link-white">LOGIN</a>
              </Link>}

          </li>
        </ul>
      </div>
    </div>
  </nav>
)

export default Nav
