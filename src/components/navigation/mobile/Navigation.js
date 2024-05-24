import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { MobileMenuButton } from './MobileMenuButton'
import { NearSocialLogo } from '../../icons/NearSocialLogo'
import { NotificationWidget } from '../NotificationWidget'
import { SignInButton } from '../SignInButton'
import { StarButton } from '../StarButton'
import { MutationDropdown } from '../desktop/MutationDropdown'

const StyledNavigation = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--slate-dark-1);
  z-index: 1000;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-controls {
    display: flex;
    width: calc(50% - 12px - 3vw);

    .mutable-section {
      margin-left: 3vw;
      flex: 1;
      max-width: 222px;
    }
  }

  .logo-link {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
  }

  .nav-notification-widget {
    margin: 0;
  }

  .nav-sign-in-btn {
    background: none;
    border: none;
    padding-right: 0;
  }
`

export function Navigation(props) {
  return (
    <StyledNavigation>
      <div className="left-controls">
        <MobileMenuButton onClick={props.onClickShowMenu} currentPage={props.currentPage} />
        <div className="mutable-section">
          <MutationDropdown engine={props.mutationEngine} listPosition="left" />
        </div>
      </div>
      <Link
        to="/"
        className="logo-link"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <NearSocialLogo />
      </Link>
      {props.signedIn ? (
        <div className="d-flex">
          <StarButton {...props} />
          <NotificationWidget notificationButtonSrc={props.widgets.notificationButton} />
        </div>
      ) : (
        <SignInButton onSignIn={() => props.requestSignIn()} />
      )}
    </StyledNavigation>
  )
}
