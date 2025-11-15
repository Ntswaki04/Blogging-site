import './NewsLetterBanner.css';

const NewsLetterBanner = () => {
    return (
        <section className="newsletter-banner">
            <div className="newsletter-container">
                <div className="newsletter-content">
                    <h3>Subscribe To Our Newsletter</h3>
                    <p>Get the latest news and updates</p>
                    <div className="newsletter-form">
                        <input className="newsletter-input" type="email" placeholder="Fill in your email address" />
                        <button className="newsletter-btn">Subscribe</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsLetterBanner;