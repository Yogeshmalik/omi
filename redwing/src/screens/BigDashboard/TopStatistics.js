import React from 'react';
export const TopStatistics = ({ text, count, isLink = false }) => {
	return (
		<div style={{ color: 'white', fontSize: 12, textDecoration: 'none' }}>
			<div style={{ fontSize: 25 }}>{count}</div>
			{isLink ? (
				<a
					href='https://redwing.puneetpugalia.com/pages/sleeping_task.php'
					target='_blank'
					rel='noreferrer'
					style={{ color: 'white' }}
				>
					<div style={{ fontSize: 12 }}>{text}</div>
				</a>
			) : (
				<div style={{ fontSize: 12 }}>{text}</div>
			)}
		</div>
	);
};

