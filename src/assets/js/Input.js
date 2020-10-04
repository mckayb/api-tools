import styled from 'styled-components';

const Input = styled.input.attrs(props => ({
  type: props.type || "text"
}))`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  width: 100%;
  margin: 0;
  padding: 1em;
`;

export default Input