import styled from "styled-components";

export const ListContainer = styled.div`
  width: 280px;
  height: 420px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: #e4e1e1;
  top: 30px;
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
  justify-content: space-around;
  flex-direction: row;
  gap: 55px;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
`;

export const CallInformation = styled.div`
  width: 150px;
  color: black;
  display: flex;
  gap: 64px;
  width: 160px;
`;
export const ButtonContainer = styled.div`
  color: black;
  display: flex;
  width: 50px;
`;
