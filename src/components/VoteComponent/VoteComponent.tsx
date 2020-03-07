import React, { FunctionComponent } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import './VoteComponent.css';


interface OwnProps {}

type Props = OwnProps;

const VoteComponent: FunctionComponent<Props> = (props) => {

   return (

   <Container>
         <Col >
         <div className="vertical-break-20"></div>
         </Col>
      <Row className="d-flex flex-row h-100 center-text">
         <Col >
         <h1>Vote application </h1>
         </Col>
      </Row>
      <Row >
         <Col >
         <div className="vertical-break-100"></div>
         </Col>
      </Row>
      <Row className="d-flex center-text center-element">
         <Col className="center-element">
            <Button variant="dark" size="lg">Vote for YES</Button>
         </Col>
         <Col className="center-element">
            <Button variant="dark" size="lg">Vote for NO</Button>
         </Col>
      </Row>
      <div className="vertical-break-100"></div>
      <div className="vertical-break-50"></div>

      <Table bordered size="sm">
  <thead className="header-table">
    <tr>
      <th colSpan={2} className="center-text">Stats</th>
    </tr>
  </thead>
  <tbody>
  <tr className="sub-header-table">
      <td className="center-text"><b>Votes for</b></td>
      <td className="center-text"><b>Counts</b></td>
    </tr>
    <tr>
      <td>YES</td>
      <td>3</td>
    </tr>
    <tr>
      <td>NO</td>
      <td>12</td>

    </tr>
  </tbody>
</Table>
   </Container>

   );
   };

   export default VoteComponent;