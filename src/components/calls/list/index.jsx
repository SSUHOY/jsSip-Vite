import { useState } from "react";
import * as S from "./callslist.styled";
import PropTypes from "prop-types";
import {
  CloseCircleOutlined,
  ArrowDownOutlined,
  PhoneOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

const CallsListPopUp = ({ openList, setListIsOpen, calls }) => {
  const [selectedOption, setSelectedOption] = useState("incoming");

  // Фильтрация входящих звонков
  const incomingCalls = calls.filter((call) => call.type === "incoming");

  // Фильтрация исходящих звонков
  const outgoingCalls = calls.filter((call) => call.type === "outgoing");

  CallsListPopUp.propTypes = {
    openList: PropTypes.bool.isRequired,
    setListIsOpen: PropTypes.func.isRequired,
    calls: PropTypes.array.isRequired,
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
          <option value="incoming">Incoming</option>
          <option value="outgoing">Outgoing</option>
        </select>
      </div>
      <div>
        {selectedOption === "incoming" ? (
          <S.CallsListContainer>
            {incomingCalls.map((item) => (
              <S.CallItem key={item.id} data-value={item.number}>
                <S.CallInformation>
                  <ArrowDownOutlined style={{ color: "black" }} />
                  <span>{item.number}</span>
                </S.CallInformation>
                <S.ButtonContainer>
                  <Button type="primary">
                    <PhoneOutlined />
                  </Button>
                </S.ButtonContainer>
              </S.CallItem>
            ))}
          </S.CallsListContainer>
        ) : (
          <S.CallsListContainer>
            {outgoingCalls.map((item) => (
              <S.CallItem key={item.id} data-value={item.number}>
                <S.CallInformation>
                  <ArrowUpOutlined style={{ color: "black" }} />
                  <span>{item.number}</span>
                </S.CallInformation>
                <S.ButtonContainer>
                  <Button type="primary">
                    {" "}
                    <PhoneOutlined />
                  </Button>
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
