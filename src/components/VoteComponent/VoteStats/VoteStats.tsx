import React, {FunctionComponent} from 'react';
import {Table} from 'react-bootstrap';
import '../VoteStats/VoteStats.css';


interface OwnProps {
    votesForYes: number,
    votesForNo: number,
}

type Props = OwnProps;

const VoteStats: FunctionComponent<Props> = (props) => {


    return (
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
                <td>{props.votesForYes}</td>
            </tr>
            <tr>
                <td>NO</td>
                <td>{props.votesForNo}</td>
            </tr>
            </tbody>
        </Table>
    )
};

export default VoteStats;
