import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import {
  useMutableWeb,
  useMutationApp,
} from "../../contexts/mutable-web-context";
import { Image } from "./image";

const SidePanelWrapper = styled.div`
  position: fixed;
  z-index: 5000;
  display: flex;
  width: 58px;
  top: 55px;
  right: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px 0px 0px 4px;
  background: ${(props) => (props.$isApps ? "#EEEFF5" : "#F8F9FF")};
  box-shadow: 0 4px 20px 0 rgba(11, 87, 111, 0.15);
  font-family: sans-serif;
  box-sizing: border-box;
`;

const TopBlock = styled.div`
  display: flex;
  width: 58px;
  flex-direction: column;
  justify-content: center;
  padding: 6px;
  background: ${(props) => (props.$open ? "#fff" : "transparent")};
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #e2e2e5;
  border-radius: ${(props) =>
    props.$noMutations ? "4px 0 0 4px" : "4px 0 0 0"};
`;

const MutationIconWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  outline: none;
  border: none;
  background: #fff;
  padding: 0;
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
  position: relative;
  box-shadow: 0 4px 5px 0 rgba(45, 52, 60, 0.2);

  .labelAppCenter {
    opacity: 0;
  }

  img {
    box-sizing: border-box;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const ApplicationIconWrapper = styled.button`
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  outline: none;
  border: none;
  background: #fff;
  padding: 0;
  border-radius: 50%;
  transition: all 0.15s ease-in-out;
  position: relative;
  box-shadow: 0 4px 5px 0 rgba(45, 52, 60, 0.2);

  .labelAppCenter {
    opacity: 0;
  }

  img {
    box-sizing: border-box;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    filter: ${(props) => (props.$isStopped ? "grayscale(1)" : "grayscale(0)")};
    transition: all 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 0px 4px 20px 0px #0b576f26, 0px 4px 5px 0px #2d343c1a;

    img {
      filter: brightness(115%);
    }
  }

  &:active {
    box-shadow: 0px 4px 20px 0px #0b576f26, 0px 4px 5px 0px #2d343c1a;

    img {
      filter: brightness(125%);
    }
  }

  &:hover .labelAppTop {
    opacity: ${(props) => (props.$isStopped ? "0" : "1")};
  }

  &:hover .labelAppCenter {
    opacity: 1;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  box-sizing: content-box !important;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 46px;
  margin-top: -7px;
  padding: 0 5px 5px;
`;

const Loading = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 46px;
  height: 46px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #fff;
  opacity: 0.8;
`;

const AppsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 6px;
  gap: 10px;
`;

const LabelAppCenter = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  top: 25%;
  left: 25%;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const LabelAppTop = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const ButtonOpenWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 32px;
  background: ${(props) => (props.$open ? "#fff" : "transparent")};
  padding-left: 6px;
  padding-right: 6px;
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #e2e2e5;
  border-radius: 0 0 0 4px;
  transition: all 0.2s ease;

  .svgTransform {
    svg {
      transition: all 0.2s ease;
      transform: rotate(180deg);
    }
  }
`;

const ButtonOpen = styled.button`
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 22px;
  outline: none;
  background: transparent;
  border-radius: 4px;
  border: ${(props) => (props.$open ? "none" : "1px solid #e2e2e5")};
  padding: 0;
  transition: all 0.2s ease;

  path {
    transition: all 0.2s ease;
    stroke: #7a818b;
  }

  &:hover {
    transition: all 0.2s ease;

    background: #fff;

    path {
      stroke: #384bff;
    }
  }

  &:active {
    background: #384bff;

    path {
      stroke: #fff;
    }
    transition: all 0.2s ease;
  }
`;

const MutationFallbackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
  >
    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" fill="#F8F9FF" />
    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#E2E2E5" />
    <g clipPath="url(#clip0_352_10)">
      <path
        d="M32 26.1425C32 27.0292 31.796 27.8418 31.3886 28.5809C30.9807 29.32 30.4355 29.9079 29.7522 30.3446C29.0689 30.7819 28.3075 31 27.4685 31C26.7251 31 26.0356 30.8265 25.4005 30.4796C24.765 30.1326 24.2374 29.6639 23.8181 29.0724C23.4102 29.6639 22.8887 30.1326 22.2536 30.4796C21.6181 30.8265 20.9286 31 20.1857 31C19.3585 31 18.6004 30.7819 17.9109 30.3446C17.2215 29.9079 16.673 29.32 16.2656 28.5809C15.8577 27.8423 15.6542 27.0292 15.6542 26.1425V18.4708C15.6542 17.9387 16.0569 17.507 16.5533 17.507C17.0497 17.507 17.4524 17.9387 17.4524 18.4708V26.1425C17.4524 26.6822 17.575 27.1738 17.821 27.6171C18.0666 28.0605 18.3965 28.414 18.8101 28.6773C19.2236 28.9411 19.6822 29.0724 20.1857 29.0724C20.6892 29.0724 21.1264 28.9471 21.5344 28.6966C21.9418 28.446 22.2688 28.1087 22.5144 27.6846C22.76 27.2605 22.8949 26.7918 22.919 26.2775V18.4708C22.919 17.9387 23.3217 17.507 23.8181 17.507H23.8361C24.3325 17.507 24.7352 17.9387 24.7352 18.4708V26.1425C24.7352 26.6822 24.8578 27.1738 25.1038 27.6171C25.3494 28.0605 25.6793 28.414 26.0928 28.6773C26.5064 28.9411 26.965 29.0724 27.4685 29.0724C27.972 29.0724 28.4305 28.9411 28.8441 28.6773C29.2577 28.414 29.5871 28.0605 29.8331 27.6171C30.0787 27.1738 30.2018 26.6822 30.2018 26.1425V18.4708C30.2018 17.9387 30.6045 17.507 31.1009 17.507C31.5973 17.507 32 17.9387 32 18.4708V26.1425Z"
        fill="#7A818B"
      />
      <path
        d="M12 17.8575C12 16.9708 12.204 16.1582 12.6114 15.4191C13.0193 14.68 13.5645 14.0921 14.2478 13.6554C14.9311 13.2181 15.6925 13 16.5315 13C17.2749 13 17.9644 13.1735 18.5995 13.5204C19.235 13.8674 19.7626 14.3361 20.1819 14.9276C20.5898 14.3361 21.1113 13.8674 21.7464 13.5204C22.3819 13.1735 23.0714 13 23.8143 13C24.6415 13 25.3996 13.2181 26.0891 13.6554C26.7785 14.0921 27.327 14.68 27.7344 15.4191C28.1423 16.1577 28.3458 16.9708 28.3458 17.8575V25.5292C28.3458 26.0613 27.9431 26.493 27.4467 26.493C26.9503 26.493 26.5476 26.0613 26.5476 25.5292V17.8575C26.5476 17.3178 26.425 16.8262 26.179 16.3829C25.9334 15.9396 25.6035 15.586 25.1899 15.3227C24.7764 15.059 24.3178 14.9276 23.8143 14.9276C23.3108 14.9276 22.8736 15.0529 22.4656 15.3035C22.0582 15.554 21.7312 15.8914 21.4856 16.3154C21.24 16.7395 21.1051 17.2082 21.081 17.7226V25.5292C21.081 26.0613 20.6783 26.493 20.1819 26.493H20.1639C19.6675 26.493 19.2648 26.0613 19.2648 25.5292V17.8575C19.2648 17.3178 19.1422 16.8262 18.8962 16.3829C18.6506 15.9396 18.3207 15.586 17.9072 15.3227C17.4936 15.059 17.035 14.9276 16.5315 14.9276C16.028 14.9276 15.5695 15.059 15.1559 15.3227C14.7423 15.586 14.4129 15.9396 14.1669 16.3829C13.9213 16.8262 13.7982 17.3178 13.7982 17.8575V25.5292C13.7982 26.0613 13.3955 26.493 12.8991 26.493C12.4027 26.493 12 26.0613 12 25.5292V17.8575Z"
        fill="#7A818B"
      />
    </g>
    <defs>
      <clipPath id="clip0_352_10">
        <rect
          width="20"
          height="18"
          fill="white"
          transform="translate(12 13)"
        />
      </clipPath>
    </defs>
  </svg>
);

const ArrowSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
  >
    <path
      d="M1.5 1.25L7 6.75L12.5 1.25"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StopTopIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="path-1-outside-1_257_34"
      maskUnits="userSpaceOnUse"
      x="0.166687"
      y="0.166672"
      width="16"
      height="16"
      fill="black"
    >
      <rect fill="white" x="0.166687" y="0.166672" width="16" height="16" />
      <path d="M8.00002 2.16667C7.23398 2.16667 6.47543 2.31756 5.7677 2.61071C5.05997 2.90386 4.41691 3.33354 3.87523 3.87522C2.78127 4.96918 2.16669 6.45291 2.16669 8.00001C2.16669 9.5471 2.78127 11.0308 3.87523 12.1248C4.41691 12.6665 5.05997 13.0962 5.7677 13.3893C6.47543 13.6825 7.23398 13.8333 8.00002 13.8333C9.54712 13.8333 11.0308 13.2188 12.1248 12.1248C13.2188 11.0308 13.8334 9.5471 13.8334 8.00001C13.8334 7.23396 13.6825 6.47542 13.3893 5.76769C13.0962 5.05995 12.6665 4.41689 12.1248 3.87522C11.5831 3.33354 10.9401 2.90386 10.2323 2.61071C9.52461 2.31756 8.76607 2.16667 8.00002 2.16667ZM6.25002 6.25001H9.75002V9.75001H6.25002" />
      <path d="M5.66669 5.66667H10.3334V10.3333H5.66669V5.66667Z" />
    </mask>
    <path
      d="M8.00002 2.16667C7.23398 2.16667 6.47543 2.31756 5.7677 2.61071C5.05997 2.90386 4.41691 3.33354 3.87523 3.87522C2.78127 4.96918 2.16669 6.45291 2.16669 8.00001C2.16669 9.5471 2.78127 11.0308 3.87523 12.1248C4.41691 12.6665 5.05997 13.0962 5.7677 13.3893C6.47543 13.6825 7.23398 13.8333 8.00002 13.8333C9.54712 13.8333 11.0308 13.2188 12.1248 12.1248C13.2188 11.0308 13.8334 9.5471 13.8334 8.00001C13.8334 7.23396 13.6825 6.47542 13.3893 5.76769C13.0962 5.05995 12.6665 4.41689 12.1248 3.87522C11.5831 3.33354 10.9401 2.90386 10.2323 2.61071C9.52461 2.31756 8.76607 2.16667 8.00002 2.16667ZM6.25002 6.25001H9.75002V9.75001H6.25002"
      fill="#F43024"
    />
    <path d="M5.66669 5.66667H10.3334V10.3333H5.66669V5.66667Z" fill="white" />
    <path
      d="M2.16669 8.00001H0.166687H2.16669ZM8.00002 13.8333V15.8333V13.8333ZM9.75002 6.25001H11.75V4.25001H9.75002V6.25001ZM9.75002 9.75001V11.75H11.75V9.75001H9.75002ZM5.66669 5.66667V3.66667H3.66669V5.66667H5.66669ZM10.3334 5.66667H12.3334V3.66667H10.3334V5.66667ZM10.3334 10.3333V12.3333H12.3334V10.3333H10.3334ZM5.66669 10.3333H3.66669V12.3333H5.66669V10.3333ZM8.00002 0.166672C6.97133 0.166672 5.95272 0.369287 5.00233 0.762949L6.53307 4.45847C6.99815 4.26582 7.49662 4.16667 8.00002 4.16667L8.00002 0.166672ZM5.00233 0.762949C4.05195 1.15661 3.18841 1.73361 2.46102 2.461L5.28944 5.28943C5.6454 4.93347 6.06799 4.65111 6.53307 4.45847L5.00233 0.762949ZM2.46102 2.461C0.991982 3.93004 0.166687 5.92248 0.166687 8.00001L4.16669 8.00001C4.16669 6.98334 4.57055 6.00832 5.28944 5.28943L2.46102 2.461ZM0.166687 8.00001C0.166687 10.0775 0.991982 12.07 2.46102 13.539L5.28944 10.7106C4.57055 9.99169 4.16669 9.01667 4.16669 8.00001L0.166687 8.00001ZM2.46102 13.539C3.18841 14.2664 4.05195 14.8434 5.00233 15.2371L6.53307 11.5415C6.06799 11.3489 5.6454 11.0665 5.28944 10.7106L2.46102 13.539ZM5.00233 15.2371C5.95272 15.6307 6.97133 15.8333 8.00002 15.8333L8.00002 11.8333C7.49662 11.8333 6.99815 11.7342 6.53307 11.5415L5.00233 15.2371ZM8.00002 15.8333C10.0775 15.8333 12.07 15.008 13.539 13.539L10.7106 10.7106C9.99171 11.4295 9.01668 11.8333 8.00002 11.8333L8.00002 15.8333ZM13.539 13.539C15.0081 12.07 15.8334 10.0775 15.8334 8.00001H11.8334C11.8334 9.01667 11.4295 9.99169 10.7106 10.7106L13.539 13.539ZM15.8334 8.00001C15.8334 6.97132 15.6307 5.9527 15.2371 5.00232L11.5416 6.53305C11.7342 6.99813 11.8334 7.4966 11.8334 8.00001H15.8334ZM15.2371 5.00232C14.8434 4.05193 14.2664 3.18839 13.539 2.461L10.7106 5.28943C11.0666 5.64539 11.3489 6.06797 11.5416 6.53305L15.2371 5.00232ZM13.539 2.461C12.8116 1.73361 11.9481 1.15661 10.9977 0.762949L9.46697 4.45847C9.93206 4.65111 10.3546 4.93347 10.7106 5.28943L13.539 2.461ZM10.9977 0.762949C10.0473 0.369287 9.02871 0.166672 8.00002 0.166672L8.00002 4.16667C8.50342 4.16667 9.00189 4.26582 9.46697 4.45847L10.9977 0.762949ZM6.25002 8.25001H9.75002V4.25001H6.25002V8.25001ZM7.75002 6.25001V9.75001H11.75V6.25001H7.75002ZM9.75002 7.75001H6.25002V11.75H9.75002V7.75001ZM5.66669 7.66667H10.3334V3.66667H5.66669V7.66667ZM8.33335 5.66667V10.3333H12.3334V5.66667H8.33335ZM10.3334 8.33334H5.66669V12.3333H10.3334V8.33334ZM7.66669 10.3333V5.66667H3.66669V10.3333H7.66669Z"
      fill="white"
      mask="url(#path-1-outside-1_257_34)"
    />
  </svg>
);

const PlayCenterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_194_475)">
      <path
        d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z"
        fill="#02193A"
      />
      <path d="M16.7 12L9.95 16.3301L9.95 7.66987L16.7 12Z" fill="white" />
      <path
        d="M12 1C10.5555 1 9.12506 1.28452 7.79048 1.83733C6.4559 2.39013 5.24327 3.20038 4.22183 4.22183C2.15893 6.28473 1 9.08262 1 12C1 14.9174 2.15893 17.7153 4.22183 19.7782C5.24327 20.7996 6.4559 21.6099 7.79048 22.1627C9.12506 22.7155 10.5555 23 12 23C14.9174 23 17.7153 21.8411 19.7782 19.7782C21.8411 17.7153 23 14.9174 23 12C23 10.5555 22.7155 9.12506 22.1627 7.79048C21.6099 6.4559 20.7996 5.24327 19.7782 4.22183C18.7567 3.20038 17.5441 2.39013 16.2095 1.83733C14.8749 1.28452 13.4445 1 12 1Z"
        stroke="white"
        strokeWidth="2"
      />
    </g>
    <defs>
      <clipPath id="clip0_194_475">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const StopCenterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_194_487)">
      <mask
        id="path-1-outside-1_194_487"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
        fill="black"
      >
        <rect fill="white" width="24" height="24" />
        <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM9 9H15V15H9" />
        <path d="M8 8H16V16H8V8Z" />
      </mask>
      <path
        d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM9 9H15V15H9"
        fill="#02193A"
      />
      <path d="M8 8H16V16H8V8Z" fill="white" />
      <path
        d="M2 12H0H2ZM12 22V24V22ZM15 9H17V7H15V9ZM15 15V17H17V15H15ZM8 8V6H6V8H8ZM16 8H18V6H16V8ZM16 16V18H18V16H16ZM8 16H6V18H8V16ZM12 0C10.4241 0 8.86371 0.310389 7.4078 0.913446L8.93853 4.60896C9.90914 4.20693 10.9494 4 12 4V0ZM7.4078 0.913446C5.95189 1.5165 4.62902 2.40042 3.51472 3.51472L6.34315 6.34315C7.08601 5.60028 7.96793 5.011 8.93853 4.60896L7.4078 0.913446ZM3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12H4C4 9.87827 4.84285 7.84344 6.34315 6.34315L3.51472 3.51472ZM0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853L6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12H0ZM3.51472 20.4853C4.62902 21.5996 5.95189 22.4835 7.4078 23.0866L8.93853 19.391C7.96793 18.989 7.08602 18.3997 6.34315 17.6569L3.51472 20.4853ZM7.4078 23.0866C8.86371 23.6896 10.4241 24 12 24V20C10.9494 20 9.90914 19.7931 8.93853 19.391L7.4078 23.0866ZM12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853L17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20V24ZM20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12H20C20 14.1217 19.1571 16.1566 17.6569 17.6569L20.4853 20.4853ZM24 12C24 10.4241 23.6896 8.86371 23.0866 7.4078L19.391 8.93853C19.7931 9.90914 20 10.9494 20 12H24ZM23.0866 7.4078C22.4835 5.95189 21.5996 4.62902 20.4853 3.51472L17.6569 6.34315C18.3997 7.08602 18.989 7.96793 19.391 8.93853L23.0866 7.4078ZM20.4853 3.51472C19.371 2.40042 18.0481 1.5165 16.5922 0.913446L15.0615 4.60896C16.0321 5.011 16.914 5.60028 17.6569 6.34315L20.4853 3.51472ZM16.5922 0.913446C15.1363 0.310389 13.5759 0 12 0V4C13.0506 4 14.0909 4.20693 15.0615 4.60896L16.5922 0.913446ZM9 11H15V7H9V11ZM13 9V15H17V9H13ZM15 13H9V17H15V13ZM8 10H16V6H8V10ZM14 8V16H18V8H14ZM16 14H8V18H16V14ZM10 16V8H6V16H10Z"
        fill="white"
        mask="url(#path-1-outside-1_194_487)"
      />
    </g>
    <defs>
      <clipPath id="clip0_194_487">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const AppSwitcher = ({ app }) => {
  const { enableApp, disableApp, isLoading } = useMutationApp(app.id);

  return (
    <>
      {isLoading ? (
        <Loading>
          <Spinner animation="border" variant="primary"></Spinner>
        </Loading>
      ) : (
        <ApplicationIconWrapper
          // $isStoppedCenter={app.settings.isEnabled ? true : true}
          title={app.appLocalId}
          $isStopped={!app.settings.isEnabled}
        >
          {app?.metadata.image ? (
            <Image image={app?.metadata.image} />
          ) : (
            <MutationFallbackIcon />
          )}

          {!app.settings.isEnabled ? (
            <LabelAppTop className="labelAppTop">
              <StopTopIcon />
            </LabelAppTop>
          ) : null}

          {app.settings.isEnabled ? (
            <LabelAppCenter className="labelAppCenter" onClick={disableApp}>
              <StopCenterIcon />
            </LabelAppCenter>
          ) : (
            <LabelAppCenter className="labelAppCenter" onClick={enableApp}>
              <PlayCenterIcon />
            </LabelAppCenter>
          )}
        </ApplicationIconWrapper>
      )}
    </>
  );
};

export const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutationApps, selectedMutation } = useMutableWeb();

  return (
    <SidePanelWrapper
      $isApps={mutationApps.length > 0}
      data-mweb-context-type="mweb-overlay"
      data-mweb-context-parsed={JSON.stringify({ id: "mweb-overlay" })}
    >
      <TopBlock
        $open={isOpen || mutationApps.length > 0}
        $noMutations={!mutationApps.length}
      >
        <MutationIconWrapper title={selectedMutation?.metadata.name}>
          {selectedMutation?.metadata.image ? (
            <Image image={selectedMutation?.metadata.image} />
          ) : (
            <MutationFallbackIcon />
          )}
        </MutationIconWrapper>
      </TopBlock>

      {isOpen || !mutationApps.length ? null : (
        <ButtonWrapper
          data-mweb-insertion-point="mweb-actions-panel"
          data-mweb-layout-manager="bos.dapplets.near/widget/VerticalLayoutManager"
        />
      )}

      {isOpen ? (
        <AppsWrapper>
          {mutationApps.map((app) => (
            <AppSwitcher key={app.id} app={app} />
          ))}
        </AppsWrapper>
      ) : null}

      {mutationApps.length > 0 ? (
        <ButtonOpenWrapper $open={isOpen || mutationApps.length > 0}>
          <ButtonOpen
            $open={isOpen}
            className={isOpen ? "svgTransform" : ""}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ArrowSvg />
          </ButtonOpen>
        </ButtonOpenWrapper>
      ) : null}
    </SidePanelWrapper>
  );
};

export default SidePanel;
