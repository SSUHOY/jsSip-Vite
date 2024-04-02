import styled from "styled-components";

export const DialPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding: 10px;
`;

export const DialPadChar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  color: #333;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e0e0e0;
  }
  &:active {
    background-color: #9d9d9d;
  }
`;
