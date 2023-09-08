import React, { useEffect, useState } from 'react';

const StatusCounts = ({ allusers }) => {
	const [statusCounts, setStatusCounts] = useState({
		slowdowns: 3,
		absents: 2,
		idles: 2
	});

	// Calculate Slowdowns, Absents, and Idles based on color-coding
	useEffect(() => {
		if (allusers && allusers.users) {
			const slowdowns = allusers.users.filter(user => user.color === 'Yellow').length;
			const absents = allusers.users.filter(user => user.color === 'Red').length;
			const idles = allusers.users.filter(user => user.color === 'NoColor').length;

			setStatusCounts({
				slowdowns,
				absents,
				idles
			});
		}
	}, [allusers]);
	return (
		<div className='drive container-fluid'>
			<div
				className='row'
				style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
			>
				<div className='drive-div-container col-md-2 col-3'>
					<div className='driveDiv1' style={{ backgroundColor: '#ECAF02' }}>
						<div className='driveDiv1text1' style={{ display: 'flex', justifyContent: 'center' }}>
							{statusCounts.slowdowns}
						</div>
						<div className='driveDiv1text2'>Slowdowns</div>
					</div>
				</div>

				<div className='drive-div-container col-md-2 col-3'>
					<div className='driveDiv1' style={{ backgroundColor: '#CC0000' }}>
						<div className='driveDiv1text1' style={{ display: 'flex', justifyContent: 'center' }}>
							{statusCounts.absents}
						</div>
						<div className='driveDiv1text2'>Absents</div>
					</div>
				</div>

				<div className='drive-div-container col-md-2 col-3'>
					<div className='driveDiv1' style={{ backgroundColor: '#13B497' }}>
						<div className='driveDiv1text1' style={{ display: 'flex', justifyContent: 'center' }}>
							{statusCounts.idles}
						</div>
						<div className='driveDiv1text2'>Idles</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatusCounts;
