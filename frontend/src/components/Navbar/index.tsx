import { BiChevronDown } from 'react-icons/bi'

import styles from './navbar.module.scss'

export const Navbar = () => {
  return (
    <>
      <nav className={styles.navbar}>
        <a href='/' className={styles.logo}>
          {/* <img src={logo} alt="logo" /> */}
          {/* <img src={logoText} alt="logo" /> */}
        </a>
        <div className={styles.links}>
          <a href='/groups'className={''}>Centrals</a>
          <a href='/locations'>Nodes</a>
          <div className={styles.dropdown}>
            <a className={styles.dropdownText} href='/account?tab=settings'>
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp" alt="picture" className={styles.profilePicture} />
              <span className={styles.name}>Eduardo</span>
              <BiChevronDown />
            </a>

            <div className={styles.dropdownContent}>
            </div>
          </div>
        </div >
      </nav >
      <nav className={`${styles.navbarMobile}`}>
        <div className={styles.navbarTop}>
          <a href='/' className={styles.logo}>
            {/* <img src={logoText} alt="logo" /> */}
          </a>
          {/* <img
            src={logo}
            alt="burger"
            className={styles.burger}
          /> */}
        </div>
      </nav>
    </>
  )
}
