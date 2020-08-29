import styled from 'styled-components';

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;

  flex: ${(props) => props.size}
`;

export default FlexColumn