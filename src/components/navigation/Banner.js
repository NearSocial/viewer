import React from "react";
import styled from "styled-components";

const Banner = ({ setShowbanner }) => {
  return (
    <Wrapper>
      <div className="container">
        <Container>
          <BannerAlertSvg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            aria-hidden="true"
            // width="18px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            ></path>
          </BannerAlertSvg>
          <BannerText>This app is in beta. It has not been audited.</BannerText>
          <BannerLinkContainer
            href="https://docs.potlock.io/general-information/beta-phase"
            target="_blank"
          >
            <span>Learn more</span>
            <BannerLinkSvg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-[18px] group-hover:rotate-[45deg] transition-all"
            >
              <path
                d="M11.6652 6.77894C11.0834 6.78279 10.5015 6.78574 9.91929 6.78777C9.06125 6.78766 8.20376 6.79135 7.34566 6.78145C6.762 6.77478 6.29535 6.33298 6.30266 5.81732C6.31009 5.32123 6.77706 4.88706 7.32973 4.89083C9.53277 4.89897 11.7351 4.91291 13.9368 4.93265C14.6025 4.93925 14.9748 5.32235 14.9826 6.0022C15.0022 8.19227 15.0157 10.3823 15.0231 12.5723C15.0251 13.2043 14.6477 13.6102 14.0912 13.6135C13.5527 13.6152 13.1403 13.1552 13.1372 12.5298C13.1307 11.2364 13.133 9.9431 13.1287 8.64975C13.1284 8.51553 13.113 8.38013 13.0963 8.12137L12.7089 8.50873C10.6829 10.5347 8.64711 12.5508 6.63972 14.5954C6.22161 15.0212 5.62148 14.9861 5.28149 14.6461C4.88466 14.2493 4.90002 13.7158 5.32463 13.2846C7.35705 11.2478 9.39203 9.21284 11.4295 7.17969L11.7105 6.89876L11.6652 6.77894Z"
                fill="currentColor"
              ></path>
            </BannerLinkSvg>
          </BannerLinkContainer>
        </Container>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="12"
          className="close-icon"
          viewBox="0 0 384 512"
          onClick={() => {
            sessionStorage.setItem("BannerToggle", false);
            setShowbanner(0);
          }}
        >
          {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>{" "}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #dd3345;
  width: 100%;
  display: flex;
  justify-content: center;
  > .container {
    position: relative;
    display: flex;
    align-items: center;
    .close-icon {
      cursor: pointer;
      position: absolute;
      font-weight: 700;
      height: 18px;
      width: auto;
      right: 12px;
      fill: white;
      transition: all 100ms ease-in;
      :hover {
        transform: rotate(90deg);
      }
    }
  }
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
`;

const BannerText = styled.div`
  text-align: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;

  @media screen and (max-width: 768px) {
    font-size: 10px;
    margin-left: 2px;
  }
`;
const BannerLinkContainer = styled.a`
  display: flex;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  line-height: 21px;
  margin-left: 16px;
  gap: 8px;

  &:hover {
    text-decoration: none;
  }
  &:hover svg {
    transform: rotate(45deg);
  }
  @media screen and (max-width: 768px) {
    font-size: 10px;
    margin-left: 8px;
    gap: 4px;
  }
`;

const BannerLinkSvg = styled.svg`
  width: 20px;
  height: 20px;
  fill: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: rotate(45deg);
  }

  @media screen and (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

const BannerAlertSvg = styled.svg`
  width: 18px;

  @media screen and (max-width: 768px) {
    width: 14px;
  }
`;

export default Banner;
