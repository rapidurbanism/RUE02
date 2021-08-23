import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import Neighbourhood from "@components/Finance/Neighbourhood";
import { fs } from 'memfs';
import neighbourhoodData from '@stores/tables/neighbourhood.json';

const Wrapper = styled("div")`
  height: calc(100vh - 32px);
`;

const FinanceFull = observer(() => {
  fs.writeFileSync('/neighbourhood.data', JSON.stringify(neighbourhoodData[0]));
  return (
    <Wrapper>
      <Neighbourhood/>
      {/* {toJS(currentStep).mainStep === 1 ? (
        <>
          
        </>
      ) : (
        <h2>Financial model is available in Neighbourhood scale</h2>
      )} */}
    </Wrapper>
  );
});

export default FinanceFull;
