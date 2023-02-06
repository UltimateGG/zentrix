import React from 'react';
import styled from 'styled-components';


const SnackbarActionsStyle = styled.div`
  margin: 0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const ModalActions = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (<SnackbarActionsStyle {...props} />);
}

export default ModalActions;
