import styled from 'styled-components';

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;

  flex: ${(props) => props.size}
`;

export default FlexRow