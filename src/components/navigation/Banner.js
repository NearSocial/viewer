import React from "react";
import styled from "styled-components";

const Banner = ({ setShowbanner }) => {
  return (
    <Wrapper>
      <div className="container">
        <Container>
          <BannerAlertSvg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C11 5.71667 10.904 5.47933 10.712 5.288C10.52 5.09667 10.2827 5.00067 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C9 6.28333 9.096 6.521 9.288 6.713C9.48 6.905 9.71733 7.00067 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6867 3.825 17.9743 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.263333 12.6833 0.000666667 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31333 4.88333 2.02567 3.825 2.925 2.925C3.825 2.025 4.88333 1.31267 6.1 0.788C7.31667 0.263333 8.61667 0.000666667 10 0C11.3833 0 12.6833 0.262667 13.9 0.788C15.1167 1.31333 16.175 2.02567 17.075 2.925C17.975 3.825 18.6877 4.88333 19.213 6.1C19.7383 7.31667 20.0007 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6867 15.1167 17.9743 16.175 17.075 17.075C16.175 17.975 15.1167 18.6877 13.9 19.213C12.6833 19.7383 11.3833 20.0007 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
              fill="black"
            />
          </BannerAlertSvg>
          <BannerText>Creatives Public Goods Round is live </BannerText>
          <BannerLinkContainer href="/?tab=pot&potId=creatives.v1.potfactory.potlock.near">
            <span>Donate</span>
            <BannerLinkSvg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[18px] group-hover:rotate-[45deg] transition-all"
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #4bb543;
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
  path {
    fill: white;
  }
  @media screen and (max-width: 768px) {
    width: 14px;
  }
`;

export default Banner;
