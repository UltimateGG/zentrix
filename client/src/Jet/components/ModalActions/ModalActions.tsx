import React from 'react';
import styled from 'styled-components';


const ModalActionsStyle = styled.div`
  margin-top: 0.6rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    margin-bottom: 0;
  }
`;

const ModalActions = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (<ModalActionsStyle {...props} />);
}

export default ModalActions;
