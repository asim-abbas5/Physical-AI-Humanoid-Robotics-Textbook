import React from 'react';
import Content from '@theme-original/Navbar/Content';
import AuthButtons from '../../../components/AuthButtons';
import styles from './styles.module.css';

export default function ContentWrapper(props) {
  return (
    <>
      <Content {...props} />
      <div className={styles.authButtonsContainer}>
        <AuthButtons variant="header" />
      </div>
    </>
  );
}
