import React from 'react'
import Link from 'next/link'

const Jumbotron = props => (
    <div>
        <div className="jumbotron jumbotron-fluid login-box">
            <div className="container">
                <h1 className="display-4">{props.title}</h1>
                <p className="lead">{props.subtitle}</p>
                {props.form ? props.form : null}
            </div>
        </div>
    </div>
)

export default Jumbotron
