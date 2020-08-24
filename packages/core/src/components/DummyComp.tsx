import React from 'react';

export const DummyComp: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <p>hello</p>
      {children}
    </>
  );
};
