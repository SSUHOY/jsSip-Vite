import styled from "styled-components";

export const IncomingCallInformation = styled.div`
  color: black;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const BellContainer = styled.div`
  display: inline-block;
  animation: shake 0.5s ease-in-out infinite;
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
`;

export const ButtonsContainer = styled.div`
  width: 180px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;
