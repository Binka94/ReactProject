import React from 'react';

function Footer(props) {
    return (
        <footer className="page-footer deep-purple accent-1">
            <div className="container">
                <div className="row">
                <div className="col l6 s12">
                    <h6 className="black-text">DISCOVER MORE...</h6>
                    <p className="grey-text text-darken-4">I was lucky enough to have the chance of attending Sarah's workshop. In a very relaxed and friendly atmosphere, the very best experts of the luxury wedding and events industry shared with us their experiences and suggestions on how to succeed in a competitive marketplace. Sarah's unique ability to create a lively and light ambiance made this a valuable experience.</p>
                </div>
                <div className="col l4 offset-l2 s12">
                    <h6 className="black-text">Links</h6>
                    <ul>                    
                        <li><a className="grey-text text-darken-3" href="#!">Wedding Books</a></li>
                        <li><a className="grey-text text-darken-3" href="#!">Weddings</a></li>
                        <li><a className="grey-text text-darken-3" href="#!">In The Press</a></li>
                        <li><a className="grey-text text-darken-3" href="#!">Contact Us</a></li>
                        <li><a className="grey-text text-darken-3" href="#!">Privacy Policy</a></li>
                        <li><a className="grey-text text-darken-3" href="#!">Working With Us</a></li>
                    </ul>
                </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                © {new Date().getFullYear()} INTERNATIONAL LUXURY WEDDING PLANNERS & PARTY PRODUCERS PROJECT
                <a className="grey-text text-darken-4 right" href="https://github.com/Binka94/ReactProject">GitHub</a>
                </div>
            </div>
            </footer>
    );
}

export default Footer;
