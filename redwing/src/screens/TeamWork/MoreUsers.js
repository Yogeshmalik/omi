import React from 'react';

const tickSvg = (
	<svg width='16' height='13' viewBox='0 0 16 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M13.2982 1.2859C13.5588 1.0378 13.9056 0.900638 14.2654 0.90336C14.6252 0.906083 14.9699 1.04848 15.2267 1.3005C15.4835 1.55252 15.6324 1.89445 15.6419 2.25414C15.6514 2.61384 15.5208 2.96316 15.2777 3.2284L7.89621 12.4599C7.76928 12.5966 7.61609 12.7063 7.44579 12.7824C7.2755 12.8586 7.09159 12.8996 6.90508 12.9031C6.71856 12.9065 6.53326 12.8723 6.36026 12.8025C6.18726 12.7327 6.03012 12.6288 5.89822 12.4969L1.00313 7.60178C0.866812 7.47476 0.757474 7.32158 0.681639 7.15138C0.605804 6.98118 0.565026 6.79745 0.561739 6.61115C0.558452 6.42485 0.592723 6.2398 0.662507 6.06703C0.73229 5.89427 0.836158 5.73732 0.967912 5.60557C1.09967 5.47381 1.25661 5.36995 1.42938 5.30016C1.60214 5.23038 1.7872 5.19611 1.9735 5.1994C2.1598 5.20268 2.34352 5.24346 2.51372 5.3193C2.68392 5.39513 2.8371 5.50447 2.96413 5.64079L6.83801 9.51283L13.263 1.3266C13.2746 1.31236 13.287 1.29877 13.3 1.2859H13.2982Z'
			fill='#14FF00'
		></path>
	</svg>
);

const MoreUsers = ({ name, color, imgSrc, ticks }) => {
	// Create an array of tick icons based on the 'ticks' prop
	const tickIcons = Array.from({ length: ticks }, (_, index) => (
		<span key={index} style={{ marginRight: '5px', fontSize: '14px' }}>
			{tickSvg}
		</span>
	));
	return (
		<tr style={{ marginTop: '0px', paddingTop: '0px' }}>
			<td style={{ fontSize: '14px' }}>
				<div className='MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2'>
					<div
						className='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-2 MuiGrid-grid-sm-1'
						style={{ transform: 'translateY(-2px)' }}
					>
						<img
							alt='profile'
							//   src='https://media.licdn.com/dms/image/D4D03AQEmyCzQvDIMcQ/profile-displayphoto-shrink_200_200/0/1689586034828?e=1699488000&v=beta&t=swEAtkv40CKM_aywCKeA-zBuUEyCJ2vHcM5cSJabLy8'
							src={imgSrc}
							style={{ width: '24px', height: '24px' }}
						/>
					</div>
					<div
						className='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-8 MuiGrid-grid-sm-10'
						style={{ fontSize: '14px' }}
					>
						<a
							href='https://3.basecamp.com/4954106/reports/users/progress/undefined'
							target='_blank'
							rel='noreferrer'
							style={{
								color: color, // Use the dynamic color here
								paddingLeft: '2rem',
								fontSize: '14px'
							}}
						>
							{name} {/* Use the dynamic name here */}
						</a>
					</div>
				</div>
			</td>
			<td style={{ transform: 'translate(0px, -3px)', fontSize: '14px' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-start',
						marginLeft: '30px'
					}}
				>
					<span style={{ marginRight: '5px', fontSize: '14px' }}>{tickIcons}</span>
					{/* Add the remaining SVG elements here */}
					<span style={{ marginLeft: '2rem' }}></span>
				</div>
			</td>
			<td
				style={{
					transform: 'translateX(-8px)',
					fontSize: '14px',
					textAlign: 'center',
					paddingLeft: '25px'
				}}
			>
				<a
					href='https://3.basecamp.com/4954106/reports/todos/assigned/undefined'
					target='_blank'
					rel='noreferrer'
					style={{
						color: 'red',
						fontSize: '14px',
						alignContent: 'center'
					}}
				></a>
			</td>
			<td style={{ textAlign: 'center', transform: 'translateX(-8px)' }}>
				<p
					className='projectCount'
					style={{
						color: 'white',
						fontSize: '13px',
						position: 'relative',
						display: 'inline-block'
					}}
				>
					<div className='ProjectCounttip' style={{ display: 'inline-block' }}></div>
				</p>
			</td>
		</tr>
	);
};

export default MoreUsers;
