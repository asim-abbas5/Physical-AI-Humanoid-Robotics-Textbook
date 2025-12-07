import React from 'react';
import Footer from '@theme-original/Footer';
import AuthButtons from '../../components/AuthButtons';
import styles from './styles.module.css';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <div className={styles.footerAuthSection}>
        <div className="container">
          <div className={styles.authContainer}>
            <AuthButtons variant="footer" />
          </div>
        </div>
      </div>
    </>
  );
}
