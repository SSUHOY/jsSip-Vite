import styled from "styled-components";

export const ListContainer = styled.div`
  width: 280px;
  height: 400px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: rgb(228, 225, 225);
  top: 5px;
  z-index: 10000;
  position: absolute;
  display: none;
  &.open {
    display: block;
  }
`;

export const CallsListHeader = styled.div`
  color: black;
`;

export const CloseWindow = styled.div`
  padding-top: 10px;
  width: 95%;
  text-align: right;
`;

export const CallsListTitle = styled.h4`
  margin: 2px;
`;

export const CallsListContainer = styled.div`
  height: 310px;
  overflow: scroll;
  overflow-x: hidden;
`;

export const CallItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
`;

export const ItemTime = styled.p`
  color: #686868;
`;

export const CallInformation = styled.div`
  color: black;
  display: flex;
  gap: 15px;
  margin-right: 40px;
  margin-left: 15px;
  width: 160px;
`;
export const ButtonContainer = styled.div`
  color: black;
  display: flex;
  width: 50px;
`;

export const Button = styled.button`
  width: 38px;
  height: 28px;
  background-color: #00b96b;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: #07df85;
  }
  &:active {
    background-color: #05d36a;
  }
`;
