import React from 'react';
import { Button, Result } from 'antd';
const Unauthorized= () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button href='/login' type="primary">retour a la page de connexion</Button>}
  />
);
export default Unauthorized ;