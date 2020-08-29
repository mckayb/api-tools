import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  align-items: ${(props) => props.centered ? "center" : "default"};
`;

export default FlexContainer