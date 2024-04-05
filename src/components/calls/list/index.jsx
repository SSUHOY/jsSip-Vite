import { useState } from "react";
import * as S from "./callslist.styled";
import PropTypes from "prop-types";
import {
  CloseCircleOutlined,
  ArrowDownOutlined,
  PhoneOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const CallsListPopUp = ({ openList, setListIsOpen, calls, setNumber }) => {
  CallsListPopUp.propTypes = {
    openList: PropTypes.bool.isRequired,
    setListIsOpen: PropTypes.func.isRequired,
    calls: PropTypes.array.isRequired,
    setNumber: PropTypes.func,
  };

  const [selectedOption, setSelectedOption] = useState("outgoing");

  // Фильтрация входящих звонков
  const incomingCalls = calls.filter((call) => call.type === "incoming");

  // Фильтрация исходящих звонков
  const outgoingCalls = calls.filter((call) => call.type === "outgoing");

  const handleTypeSelectedNumber = (value) => {
    setNumber("");
    setListIsOpen(false);
    setNumber((prevNumber) => prevNumber + value);
  };

  return (
    <S.ListContainer className={openList ? "open" : ""}>
      <S.CallsListHeader>
        <S.CloseWindow>
          <CloseCircleOutlined onClick={() => setListIsOpen(false)} />
        </S.CloseWindow>
        <S.CallsListTitle>Calls list</S.CallsListTitle>
      </S.CallsListHeader>
      <div>
        <select
          name="calls"
          id="calls-list-select"
          onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="outgoing">Outgoing</option>
          <option value="incoming">Incoming</option>
        </select>
      </div>
      <div>
        {selectedOption === "incoming" ? (
          <S.CallsListContainer>
            {incomingCalls.map((item) => (
              <S.CallItem key={item.id} data-value={item.number}>
                <S.CallInformation>
                  <ArrowDownOutlined style={{ color: "black" }} />
                  <div style={{ width: 50 }}>
                    <p>{item.number}</p>
                    <S.ItemTime>{item.time}</S.ItemTime>
                  </div>
                </S.CallInformation>
                <S.ButtonContainer>
                  <S.Button
                    onClick={() => handleTypeSelectedNumber(item.number)}>
                    <PhoneOutlined />
                  </S.Button>
                </S.ButtonContainer>
              </S.CallItem>
            ))}
          </S.CallsListContainer>
        ) : (
          <S.CallsListContainer>
            {outgoingCalls.map((item, i) => (
              <S.CallItem key={`${item.id}_${i}`} data-value={item.number}>
                <S.CallInformation>
                  <ArrowUpOutlined style={{ color: "black" }} />
                  <div style={{ width: 50 }}>
                    <p>{item.number}</p>
                    <S.ItemTime>{item.time}</S.ItemTime>
                  </div>
                </S.CallInformation>
                <S.ButtonContainer>
                  <S.Button
                    onClick={() => handleTypeSelectedNumber(item.number)}>
                    {" "}
                    <PhoneOutlined />
                  </S.Button>
                </S.ButtonContainer>
              </S.CallItem>
            ))}
          </S.CallsListContainer>
        )}
      </div>
    </S.ListContainer>
  );
};

export default CallsListPopUp;
