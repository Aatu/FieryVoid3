import styled from "styled-components";
import { Button } from "../../styled/Button";
import { TooltipContainer, TooltipHeader } from "../../styled/Tooltip";
import { useNavigate } from "react-router-dom";

const StyledButton = styled(Button)`
  flex-grow: 0;
  flex-basis: content;
`;

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TooltipContainer>
      <TooltipHeader>Navigation</TooltipHeader>
      <StyledButton
        type="button"
        buttonstyle="button-grey"
        onClick={() => navigate("/")}
      >
        HOME
      </StyledButton>

      <StyledButton
        type="button"
        buttonstyle="button-grey"
        onClick={() => navigate("/fleetbuilder")}
      >
        Fleet builder
      </StyledButton>
    </TooltipContainer>
  );
};
