// red_wing_token = BAhbB0kiAbB7ImNsaWVudF9pZCI6IjdkMDM2OTdhZGM4ODY5OTZhNjczNjM0Yjg5ZDUxZDhmZWJiMjk5NzkiLCJleHBpcmVzX2F0IjoiMjAyMy0wOS0xOFQwODo0ODozOVoiLCJ1c2VyX2lkcyI6WzQ4NTA1NjYzXSwidmVyc2lvbiI6MSwiYXBpX2RlYWRib2x0IjoiMjQ2NmY3MmRhNjg5YTkzODdiYmNmYTRjODMwOWYyYzcifQY6BkVUSXU6CVRpbWUNSOIewPYHfsIJOg1uYW5vX251bWkCQwE6DW5hbm9fZGVuaQY6DXN1Ym1pY3JvIgcyMDoJem9uZUkiCFVUQwY7AEY=--c795d257b02b4d0cbc781dfa4fe2e655262e71a1
// red_wing_token_expiry_date = Mon Sep 18 2023 14:18:40 GMT+0530 (India Standard Time)

import axios from 'axios';
import './TeamWork.css';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { pageTransitions, pageVariants } from 'animations';
import { Container, TeamTabBottom, TeamTabTop, ModalBody, Projects } from './Style';
import {
	Button,
	Container as MdContainer,
	Grid,
	Modal,
	Box,
	CardMedia,
	Card,
	CardContent,
	TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TabComponent from 'components/TabComponent/TabComponent';
import moment from 'moment';
import useLongPress from '../../hooks/useLongPress';
import { alertClasses } from '@mui/material';
import MoreUsers from './MoreUsers';

const token = localStorage.getItem('red_wing_token');
const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

const deleteMemberStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: '#353935',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4
};

const TeamWork = ({
	isInverted,
	showTeamTabTop = true,
	showTabComponent = true,
	showActionButtons = true
}) => {
	const [tabValue, setTabValue] = useState('Team');
	const localStorageData = localStorage.getItem('redwing_data');
	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	// console.log('data=', data);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [projectId, setProjectId] = useState('');
	const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [sortingOrder, setSortingOrder] = useState('DEC');
	const [sortingColumn, setSortingColumn] = useState('tasks_count');
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [deleteMember, setDeleteMember] = useState({ img: '', name: '', user_id: '' });
	/* YSM start */
	const [loadings, setLoadings] = useState(true); // Add loading state if needed
	const [dynamicUsers, setDynamicUsers] = useState([]);
	let countRef = React.useRef({ playgroundSegment: 0, projectSegment: 0, optimiseSegment: 0 });
	const [projectsAssociation, setProjectAssociation] = useState({});

	const dynamicUserData = {
		absents: [],
		idles: [],
		slowdowns: []
	};
	const [dynamicUserDatas, setDynamicUserDatas] = useState({
		absents: [],
		idles: [],
		slowdowns: []
	});

	const handleSorting = col => {
		if (sortingColumn === col) {
			// Reverse the sorting order if the same column is clicked
			setSortingOrder(sortingOrder === 'DEC' ? 'ASC' : 'DEC');
		} else {
			// Set the new sorting column and initial sorting order
			setSortingColumn(col);
			setSortingOrder('ASC');
		}

		// Call your sorting function here
		sorting(col, sortingOrder);
	};

	/* YSM end */

	useEffect(() => {
		getTeamWorkData();
		setInterval(async () => getTeamWorkData(), 120000);
	}, []);

	const sorting = (col, sortingOrder1) => {
		// if (col === 'tasks_count' || col === 'active_count') {
		/* YSM start */
		if (col === 'tasks_count' || col === 'completed_todo') {
			/* YSM end */
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'tasks_count' || col === 'active_count') {
			/* YSM end */
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'project_ids') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col].length < b[col].length ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col].length > b[col].length ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'name') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) =>
					a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
				);

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) =>
					a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
				);

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		}
		//(sortingOrder);
	};

	const getTeamWorkData = () => {
		// setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
				headers: {
					// Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				setData(res.data);
				setProjectData(res.data.projects);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				// setLoading(false);
			})
			.catch(error => {
				console.error(error);
				// setLoading(false);
			});
	};

	// const getProjectData = () => {
	// 	setProjectLoading(true);
	// 	axios
	// 		.get(`${process.env.REACT_APP_API_URL}/pages/projects.php`, {
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 				'Access-Control-Allow-Origin': '*'
	// 			}
	// 		})
	// 		.then(res => {
	// 			setProjectData(res.data);
	// 			setProjectLoading(false);
	// 		})
	// 		.catch(error => {
	// 			console.error(error);
	// 			setProjectLoading(false);
	// 		});
	// };

	/* ********************** YSM S ****************** */
	const [selectedSegment, setSelectedSegment] = useState('defaultSegment');

	const handleSegmentChange = segmentName => {
		setSelectedSegment(segmentName);
	};

	// Render Segments
	const showSegmenting = (users, segment) => {
		const segmentName = segment.segmentName;
		let segmentTitle;
		if (segmentName === 'playgroundSegment') {
			const tab1 = [],
				tab2 = [];
			users?.reduce((prev, acc) => {
				const isRedWing =
					Object.values(acc?.projects)
						?.map(projectDetails => projectDetails?.project_name == 'RedWing')
						.filter(Boolean).length > 0;
				if (!!isRedWing) {
					tab1.push(acc);
				} else tab2.push(acc);
			}, []);
			countRef.current.playgroundSegment = tab1.length + tab2.length;
			return [tab1, tab2];
		} else if (segmentName == 'projectSegment') {
			segmentTitle = 'Project Segment';
			const tab1 = [],
				tab2 = [];
			users?.reduce((prev, acc) => {
				if (acc?.project_ids?.length > 0) {
					tab1.push(acc);
				}
				if (acc?.tasks_count == 0) {
					tab2.push(acc);
				}
			}, []);
			countRef.current.projectSegment = tab1.length + tab2.length;
			return [tab1, tab2];
		} else if (segmentName == 'optimiseSegment') {
			segmentTitle = 'Optimise Segment';
			const tab1 = [],
				tab2 = [],
				tab3 = [];
			users?.reduce((prev, acc) => {
				if (acc?.completed_todo > 5) {
					tab1.push(acc);
				} else if (acc?.completed_todo == 0) {
					tab3.push(acc);
				} else if (acc?.completed_todo > 0 && acc?.completed_todo <= 5) {
					tab2.push(acc);
				}
			}, []);
			countRef.current.optimiseSegment = tab1.length + tab2.length + tab3.length;
			return [tab1, tab2, tab3];
		}
	};

	const segments = [
		{
			segmentName: 'playgroundSegment',
			segmentTitle: 'Playground'
		},
		{
			segmentName: 'projectSegment',
			segmentTitle: 'Project Segment'
		},
		{
			segmentName: 'optimiseSegment',
			segmentTitle: 'Performance Segment'
		}
	];

	const tableNames = {
		playgroundSegment: {
			0: 'Red Wing',
			1: 'Client Projects'
		},

		projectSegment: {
			0: 'Multi Task ',
			1: 'Idle '
		},
		optimiseSegment: {
			0: '5 + Green Ticks ',
			1: '1-5 Green Ticks',
			2: 'No Green Ticks'
		}
	};

	/* ********************** YSM E ****************** */
	useEffect(() => {
		var users = [];
		if (data && data.users && data.users.length) {
			data.users.forEach(user => {
				if (user.user_id !== 33629907) {
					users.push(user);
				}
			});
			// for (var k in data.users) {
			// 	users.push(data.users[k]);
			// }
			setUsers(users);
			setSortingOrder('DEC');
			setSortingColumn('tasks_count');
			const filteredUsers = data.users.filter(user => user.user_id !== 33629907);
			const absents = filteredUsers.filter(user => user.active_todo_count === 0);
			const idles = filteredUsers.filter(
				user => user.active_todo_count > 0 && user.tasks_count === 0
			);
			const slowdowns = filteredUsers.filter(
				user => user.active_todo_count > 0 && user.tasks_count > 0
			);

			dynamicUserData.absents = absents;
			dynamicUserData.idles = idles;
			dynamicUserData.slowdowns = slowdowns;
			setDynamicUsers(filteredUsers);
		}
		console.log('firstt', users);
		let projectand = users.reduce((prev, curr) => {
			Object.values(curr?.projects).forEach(project => {
				if (prev[project.project_name]) {
					prev[project.project_name].push(curr.name.split(' ')[0]);
				} else prev[project.project_name] = [curr.name];
			});
			return prev;
		}, {});
		setProjectAssociation(projectand);
		// console.log('projectand', projectand);
		// console.log(`Number of Absents: ${dynamicUserData.absents.length}`);
		// console.log(
		// 	`Number of Idles: ${dynamicUserData.idles.length}, Names of Idles: ${dynamicUserData.idles
		// 		.map(user => user.name)
		// 		.join(', ')}`
		// );
		// console.log(
		// 	`Number of Slow: ${
		// 		dynamicUserData.slowdowns.length
		// 	}, Names of Slowdowns: ${dynamicUserData.slowdowns.map(user => user.name).join(', ')}`
		// );

		// console.log(`Number of Slowdowns: ${dynamicUserData.slowdowns.length}`);
	}, [data]);

	useEffect(() => {
		var projects = [];
		for (var k in projectData) {
			projects.push(projectData[k]);
		}
		setProjects(projects);
		// console.log(projects);
	}, [projectData]);

	const handleRefreshUserList = () => {
		setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/refresh_user_list.php`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				if (res.data.status === true) {
					alert(res.data.message);
					getTeamWorkData();
					// getProjectData();
				} else {
					alert('Something went wrong');
					// console.log(res.data);
				}
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	};

	const onSVGClick = () => {
		if (tabValue === 'Team') {
			setTabValue('Projects');
		}
		if (tabValue === 'Projects') {
			setTabValue('Team');
		}
	};

	const handleOpenProjectModal = () => {
		setOpenAddProjectModal(true);
	};

	const handleCloseProjectModal = () => {
		setOpenAddProjectModal(false);
	};

	const handleAddProjectId = () => {
		if (projectId) {
			setLoading(true);
			handleCloseProjectModal();
			axios
				.post(
					`${process.env.REACT_APP_API_URL}/pages/add_project.php`,
					{ project_id: projectId },
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Access-Control-Allow-Origin': '*'
						}
					}
				)
				.then(res => {
					if (res.data.status === true) {
						alert(res.data.message);
						setProjectId('');
						getTeamWorkData();
						// getProjectData();
					} else {
						handleOpenProjectModal();
						alert('Something went wrong');
						// console.log(res.data);
					}
					setLoading(false);
				})
				.catch(error => {
					console.error(error);
					setLoading(false);
				});
		}
	};

	const handleCloseDeleteModal = () => {
		setOpenDeleteModal(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
					headers: {
						// Authorization: `Bearer ${token}`,
						'Access-Control-Allow-Origin': '*'
					}
				});
				const data = response.data;

				const filteredUsers = data.users.filter(user => user.user_id !== 33629907);
				// Filter out the user named "Kajal" from slowdowns and absents
				const absents = filteredUsers.filter(
					user => user.active_todo_count === 0 && user.name !== 'Kajal Patel'
				);
				const idles = filteredUsers.filter(
					user => user.active_todo_count > 0 && user.tasks_count === 0
				);
				const slowdowns = filteredUsers.filter(
					user => user.active_todo_count > 0 && user.tasks_count > 0 && user.name !== 'Kajal Patel'
				);

				setDynamicUserDatas({
					absents,
					idles,
					slowdowns
				});

				setLoadings(false);
			} catch (error) {
				console.error(error);
				setLoadings(false);
			}
		};

		fetchData();
	}, []);

	return (
		<>
			<motion.div
				initial='initial'
				animate={isInverted ? 'inRight' : 'inLeft'}
				exit={isInverted ? 'outRight' : 'outLeft'}
				variants={pageVariants}
				transition={pageTransitions}
				style={{ width: '100%', height: '100%' }}
			>
				<Container>
					{showTabComponent && (
						<TabComponent
							active={tabValue}
							setActive={setTabValue}
							tabList={['Team', 'Projects']}
							counts={{ Team: users?.length }}
						/>
					)}
					{tabValue === 'Team' && (
						<>
							{showTeamTabTop && (
								<TeamTabTop>
									<table style={{ width: '100%' }}>
										<tr align='center'>
											<th align='center'>Today</th>
											<th align='center'>Average</th>
											<th align='center'>Sleeping</th>
											<th align='center'>Unassigned</th>
										</tr>
										<tr style={{ alignItems: 'center', margin: 'auto' }}>
											<td align='center'>{data.tickets_created_today}</td>
											<td>{data.average}</td>
											<td>
												<a
													href='https://redwing.puneetpugalia.com/pages/sleeping_task.php'
													target='_blank'
													rel='noreferrer'
													style={{ color: 'white' }}
												>
													{data.sleeping_tasks}
												</a>
											</td>
											<td>
												<a
													href='https://redwing.puneetpugalia.com/pages/unassigned_task.php'
													target='_blank'
													rel='noreferrer'
													style={{ color: 'white' }}
												>
													{data.unassigned_tasks}
												</a>
											</td>
										</tr>
									</table>
								</TeamTabTop>
							)}
							{/* {showSegmenting(users)?.tabs.map((tab, index) => ( */}
							{/* Render tables based on the selected segment */}
							{/* <h2>{segment.segmentTitle}</h2> */}
							{/* {selectedSegment === segment.segmentName && (						 */}
							{segments.map(segment => (
								<div
									key={segment.segmentName}
									style={{
										marginBottom: '2rem'
									}}
								>
									<TeamTabBottom
										style={{
											marginBottom: '2rem'
										}}
									>
										<table
											style={{
												marginBottom: '5rem'
											}}
											cellspacing='0'
											cellpadding='0'
										>
											<thead>
												<tr>
													<th
														onClick={e => {
															e.preventDefault();
															setSortingColumn('name');
															if (sortingOrder === 'ASC') {
																sorting('name', 'ASC');
															} else {
																sorting('name', 'DEC');
															}
														}}
														style={{
															transform: 'translateX(-6px)',
															fontSize: '14px',
															lineHeight: '21px',
															fontFamily: 'Poppins',
															fontWeight: '500',
															width: '1%',
															'white-space': 'nowrap'
														}}
													>
														{countRef.current[segment.segmentName]} {segment.segmentTitle}
														{/* {tab.length} Team Members{showSegmenting(users)?.segmentTitle} */}
														{sortingColumn === 'name' ? (
															<a href='/' style={{ color: 'white', marginLeft: '2px' }}>
																{sortingOrder === 'ASC' ? (
																	<ArrowUpwardIcon />
																) : (
																	<ArrowDownwardIcon />
																)}
															</a>
														) : (
															''
														)}
													</th>

													<th
														/* YSM start */
														onClick={() => handleSorting('completed_todo')}
														style={{
															textAlign: 'left',
															position: 'relative',
															right: '-30px',
															paddingRight: '5rem',
															fontSize: '14px',
															lineHeight: '21px',
															fontFamily: 'Poppins',
															fontWeight: '500',
															width: 'max-content',
															cursor: 'pointer'
															/* YSM end */
														}}
													>
														Activity
														{/* YSM start */}
														{sortingColumn === 'completed_todo' && (
															<span style={{ color: 'white', marginLeft: '2px' }}>
																{sortingOrder === 'ASC' ? (
																	<ArrowUpwardIcon />
																) : (
																	<ArrowDownwardIcon />
																)}
															</span>
														)}
														{/* YSM end */}
													</th>

													<th
														onClick={e => {
															e.preventDefault();
															setSortingColumn('tasks_count');
															if (sortingOrder === 'ASC') {
																sorting('tasks_count', 'ASC');
															} else {
																sorting('tasks_count', 'DEC');
															}
														}}
														style={{
															textAlign: 'center',
															paddingRight: '2%',
															fontSize: '14px',
															lineHeight: '21px',
															fontFamily: 'Poppins',
															fontWeight: '500',
															width: '1%',
															'white-space': 'nowrap'
														}}
													>
														Tasks
														{sortingColumn === 'tasks_count' ? (
															<a style={{ color: 'white', marginLeft: '2px' }} href='/'>
																{sortingOrder === 'ASC' ? (
																	<ArrowUpwardIcon style={{ position: 'relative', top: '2px' }} />
																) : (
																	<ArrowDownwardIcon style={{ position: 'relative', top: '2px' }} />
																)}
															</a>
														) : (
															''
														)}{' '}
													</th>
													<th
														onClick={e => {
															e.preventDefault();
															setSortingColumn('project_ids');
															if (sortingOrder === 'ASC') {
																sorting('project_ids', 'ASC');
															} else {
																sorting('project_ids', 'DEC');
															}
														}}
														style={{
															textAlign: 'center',
															// paddingRight: '1.5rem',
															fontSize: '14px',
															lineHeight: '21px',
															fontFamily: 'Poppins',
															fontWeight: '500',
															width: '1%',
															'white-space': 'nowrap'
														}}
													>
														Projects
														{sortingColumn === 'project_ids' ? (
															<a style={{ color: 'white', marginLeft: '2px' }} href='/'>
																{sortingOrder === 'ASC' ? (
																	<ArrowUpwardIcon style={{ position: 'relative', top: '2px' }} />
																) : (
																	<ArrowDownwardIcon style={{ position: 'relative', top: '2px' }} />
																)}
															</a>
														) : (
															''
														)}
													</th>
												</tr>
											</thead>
											<tbody>
												<>
													{/* {tab.map((user, key) => {
													return (
														<>
															<TableRow
																key={key}
																img={user.avatar}
																user_id={user.user_id}
																tasks={user.tasks_count}
																name={user.name}
																active={user.active_count}
																active_todo={user.active_todo_count}
																projects={user.project_ids}
																completed_todo={user.completed_todo}
																last_active_at={user.last_active_at}
																projectsdata={projects}
																data={data.users}
																getTeamWorkData={getTeamWorkData}
																setLoading={setLoading}
															/>
														</>
													);
												})} */}
													{showSegmenting(users, segment)?.map((tab, index) => (
														<React.Fragment key={index}>
															{/* Add subheading for the sub-table here */}
															<tr>
																<th
																	colSpan='1'
																	style={{
																		// textAlign: 'center',
																		paddingRight: '2%',
																		fontSize: '14px',
																		lineHeight: '21px',
																		fontFamily: 'Poppins',
																		fontWeight: '500',
																		width: '1%',
																		'white-space': 'nowrap',
																		paddingBottom: '10px'
																	}}
																>
																	{tab.length} In {tableNames[segment.segmentName][index]}
																</th>
															</tr>
															{tab.map((user, key) => (
																<TableRow
																	key={key}
																	img={user.avatar}
																	user_id={user.user_id}
																	tasks={user.tasks_count}
																	name={user.name}
																	active={user.active_count}
																	active_todo={user.active_todo_count}
																	projects={user.project_ids}
																	completed_todo={user.completed_todo}
																	last_active_at={user.last_active_at}
																	projectsdata={projects}
																	data={data.users}
																	getTeamWorkData={getTeamWorkData}
																	setLoading={setLoading}
																/>
															))}
														</React.Fragment>
													))}
												</>

												{users
													? // users.map((user, key) => {
													  // 		return (
													  // 			<>
													  // 				<TableRow
													  // 					key={key}
													  // 					img={user.avatar}
													  // 					user_id={user.user_id}
													  // 					tasks={user.tasks_count}
													  // 					name={user.name}
													  // 					active={user.active_count}
													  // 					active_todo={user.active_todo_count}
													  // 					projects={user.project_ids}
													  // 					completed_todo={user.completed_todo}
													  // 					last_active_at={user.last_active_at}
													  // 					projectsdata={projects}
													  // 					data={data.users}
													  // 					getTeamWorkData={getTeamWorkData}
													  // 					setLoading={setLoading}
													  // 				/>
													  // 			</>
													  // 		);
													  //   })
													  ''
													: ''}
											</tbody>
										</table>
										{showActionButtons && (
											<MdContainer maxWidth='md'>
												{token &&
													token !== 'undefined' &&
													new Date(token_expiry_date) > new Date() && (
														<Grid container spacing={3} direction='row' justifyContent='center'>
															<Grid item>
																<Button
																	variant='contained'
																	color='primary'
																	onClick={handleOpenProjectModal}
																>
																	Add New Project
																</Button>
															</Grid>
															<Grid item>
																<Button
																	variant='contained'
																	onClick={handleRefreshUserList}
																	color='primary'
																>
																	Refresh User List
																</Button>
															</Grid>
														</Grid>
													)}
												{(!token ||
													token === 'undefined' ||
													new Date(token_expiry_date) <= new Date()) && (
													<Grid container spacing={3} direction='row' justifyContent='center'>
														<Grid item>
															<a href='https://launchpad.37signals.com/authorization/new?type=web_server&client_id=7d03697adc886996a673634b89d51d8febb29979&redirect_uri=https://touch-dashborad.herokuapp.com/auth/callback'>
																<Button variant='contained' color='primary'>
																	Login to Basecamp
																</Button>
															</a>
														</Grid>
													</Grid>
												)}
											</MdContainer>
										)}
									</TeamTabBottom>
									{segment.segmentName === 'projectSegment' && (
										<Projects
											style={{
												color: 'red',
												fontSize: '1.35rem',
												margin: '5rem 0'
											}}
										>
											<table>
												<thead>
													<tr>
														<th
															style={{
																textAlign: 'left',
																color: '#1bdb51',
																fontWeight: 'bold',
																fontSize: '1.7rem'
															}}
														>
															Projects
														</th>
														<th
															style={{
																textAlign: 'left',
																color: '#1bdb51',
																fontWeight: 'bold',
																fontSize: '1.7rem'
															}}
														>
															People Involved
														</th>
													</tr>
												</thead>
												<tbody>
													{Object.keys(projectsAssociation).map(project => (
														<tr key={project} style={{ textAlign: 'left' }}>
															<td
																style={{
																	fontWeight: '400',
																	fontSize: '1.3rem',
																	paddingLeft: '.5rem'
																}}
															>
																{project}
															</td>
															<td
																style={{
																	textAlign: 'left',
																	paddingRight: '8rem',
																	paddingLeft: '1.5rem',
																	fontWeight: '400',
																	fontSize: '1.3rem'
																}}
															>
																{projectsAssociation[project]?.join(', ')}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</Projects>
									)}
									{/* )} */}
								</div>
							))}
						</>
					)}
					{/* *************************** YSM S ******************************* */}
					{
						<div
							style={{
								padding: '2rem 1.5rem'
							}}
						>
							<div>
								<p
									style={{
										color: 'red',
										fontSize: '1.35rem',
										marginBottom: '10px'
									}}
								>
									{dynamicUserDatas.absents.length} Absents:{' '}
									{dynamicUserDatas.absents.length > 0 && (
										<span style={{ color: 'white', fontSize: 'small' }}>
											{dynamicUserDatas.absents.map((user, index) => (
												<span key={user.user_id}>
													{user.name.split(' ')[0]}
													{index < dynamicUserDatas.absents.length - 1 ? ', ' : ''}
												</span>
											))}
										</span>
									)}
								</p>
							</div>
							<div>
								<p
									style={{
										color: 'yellow',
										fontSize: '1.35rem',
										marginBottom: '10px'
									}}
								>
									{dynamicUserDatas.slowdowns.length} Slowdowns:{' '}
									{dynamicUserDatas.slowdowns.length > 0 && (
										<span style={{ color: 'white', fontSize: 'small' }}>
											{dynamicUserDatas.slowdowns.map((user, index) => (
												<span key={user.user_id}>
													{user.name.split(' ')[0]}
													{index < dynamicUserDatas.slowdowns.length - 1 ? ', ' : ''}
												</span>
											))}
										</span>
									)}
								</p>
							</div>
							<div>
								<p
									style={{
										color: '#13b497',
										fontSize: '1.35rem'
									}}
								>
									{dynamicUserDatas.idles.length} Idles:{' '}
									{dynamicUserDatas.idles.length > 0 && (
										<span style={{ color: 'white', fontSize: 'small' }}>
											{dynamicUserDatas.idles.map((user, index) => (
												<span key={user.user_id}>
													{user.name.split(' ')[0]}
													{index < dynamicUserDatas.idles.length - 1 ? ', ' : ''}
												</span>
											))}
										</span>
									)}
								</p>
							</div>
						</div>
					}
					{/* *************************** YSM E ******************************* */}
					{tabValue === 'Projects' && (
						<Projects>
							<h2>Projects</h2>
							<table>
								<thead>
									<tr>
										<th>Projects</th>
										<th style={{ textAlign: 'center' }}>Tasks Today</th>
									</tr>
								</thead>
								<tbody>
									{projects
										? projects.map((project, key) => {
												return (
													<tr>
														<td>{project.name}</td>
														<td>{project.todos_created_today_count}</td>
													</tr>
												);
										  })
										: ''}
								</tbody>
							</table>
							<MdContainer maxWidth='md'>
								{token && token !== 'undefined' && new Date(token_expiry_date) > new Date() && (
									<Grid container spacing={3} direction='row' justifyContent='center'>
										<Grid item>
											<Button variant='contained' color='primary' onClick={handleOpenProjectModal}>
												Add New Project
											</Button>
										</Grid>
										<Grid item>
											<Button variant='contained' onClick={handleRefreshUserList} color='primary'>
												Refresh User List
											</Button>
										</Grid>
									</Grid>
								)}
								{(!token || token === 'undefined' || new Date(token_expiry_date) <= new Date()) && (
									<Grid container spacing={3} direction='row' justifyContent='center'>
										<Grid item>
											<a href='https://launchpad.37signals.com/authorization/new?type=web_server&client_id=7d03697adc886996a673634b89d51d8febb29979&redirect_uri=https://touch-dashborad.herokuapp.com/auth/callback'>
												<Button variant='contained' color='primary'>
													Login to Basecamp
												</Button>
											</a>
										</Grid>
									</Grid>
								)}
							</MdContainer>
						</Projects>
					)}
				</Container>
				{/* Modal for deleting team member */}

				<Modal
					open={openAddProjectModal}
					onClose={handleCloseProjectModal}
					aria-labelledby='simple-modal-title'
					aria-describedby='simple-modal-description'
				>
					<Grid
						container
						spacing={3}
						direction='row'
						justifyContent='center'
						alignItems='center'
						style={{ height: '100vh' }}
					>
						<Grid
							item
							xs={10}
							sm={8}
							md={5}
							style={{
								width: 400,
								backgroundColor: 'white',
								border: '2px solid #000',
								padding: '3px'
							}}
						>
							<ModalBody>
								<div className='modal_header'>
									<Typography variant='h2' style={{ position: 'relative' }}>
										Add Project
										<CloseIcon
											fontSize='large'
											style={{ position: 'absolute', right: '0', cursor: 'pointer' }}
											onClick={handleCloseProjectModal}
										/>
									</Typography>
								</div>
								<div className='modal_body'>
									<TextField
										id='outlined-basic'
										label='Project Id'
										variant='outlined'
										fullWidth={true}
										onChange={function (event) {
											setProjectId(event.target.value);
										}}
									/>
									<Button variant='contained' onClick={handleAddProjectId}>
										Add
									</Button>
								</div>
							</ModalBody>
						</Grid>
					</Grid>
				</Modal>
				<Backdrop className={classes.backdrop} open={loading}>
					<CircularProgress color='inherit' />
				</Backdrop>
			</motion.div>
		</>
	);
};

const TableRow = props => {
	// Check if props.active is not null before accessing it
	const activeCount = props.active ? parseInt(props?.active?.split('(')[0]) : 0;

	const getProjectname = projectid => {
		for (let i = 0; i < props.projectsdata.length; i++) {
			if (props.projectsdata[i].project_id === projectid) {
				let c = getProjectCount(projectid, props.user_id);
				let s = props.projectsdata[i].name;
				// if(s.length>13){
				// 	s=s.slice(0,12)+'...';
				// }
				return s + ' (' + c + ')';
			}
		}
	};
	const getProjectCount = (projectid, userid) => {
		// console.log(props.data);
		for (let i = 0; i < props.data.length; i++) {
			if (props.data[i].user_id === userid) {
				return props.data[i]?.projects[projectid]?.count;
			}
		}
	};
	const handleDeleteMember = user_id => {
		// console.log(user_id);
		axios
			.post(
				`${process.env.REACT_APP_API_URL}/pages/delete_user.php`,
				{ user_id: user_id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Access-Control-Allow-Origin': '*'
					}
				}
			)
			.then(res => {
				if (res.data.success === true) {
					alert(res.data.message);
					// getProjectData();
				} else {
					alert('Something went wrong');
					// console.log(res.data);
				}
				props.getTeamWorkData();
				props.setLoading(false);
			})
			.catch(error => {
				console.error(error);
				props.setLoading(false);
			});
	};

	const onAvatarLongPress = () => {
		// props.setDeleteMember({img:props.img, name:props.name, user_id:props.user_id})
		// props.setOpenDeleteModal(true)
		if (window.confirm('Do you want to delete this user?')) {
			handleDeleteMember(props.user_id);
		}
	};

	const onAvatarClick = () => {
		console.log('click is triggered');
	};

	const defaultOptions = {
		shouldPreventDefault: true,
		delay: 500
	};
	const longPressAvatarEvent = useLongPress(onAvatarLongPress, onAvatarClick, defaultOptions);

	/* ************************** YSM S ****************** */
	const userNameColor =
		props.name === 'Kajal Patel'
			? 'white'
			: moment().diff(moment(props.last_active_at), 'hours') >= 3 || props.active_todo_count === 0
			? 'red' // Absent users are in red
			: props.active_todo_count > 0 && props.tasks_count > 0
			? 'yellow' // Slowdown users are in yellow
			: props.active_todo_count > 0 && props.tasks_count === 0
			? '#13b497' // Idle users are in #13b497 (greenish color)
			: 'white'; // Default color (if none of the conditions match)

	const setUserColor = React.useMemo(() => {
		// debugger
		const current = props.data.find(user => user.name == props.name);
		if (props.name === 'Kajal Patel') {
			return 'white';
		} else if (
			moment().diff(moment(current.last_active_at), 'hours') >= 3 ||
			current.active_todo_count === 0
		) {
			return 'red';
		} else if (current.active_todo_count > 0 && current.tasks_count > 0) {
			return 'yellow';
		} else if (current.active_todo_count > 0 && current.tasks_count === 0) {
			return '#13b497';
		} else {
			return 'white';
		}
	}, [props.name]);
	// console.log('YSM Color', setUserColor);
	/* ************************** YSM S ****************** */

	// console.log(parseInt(props.active?.split('(')[0]) - props.completed_todo);
	// console.log(props.active);
	return (
		<tr style={{ marginTop: '0', paddingTop: '0' }}>
			<td style={{ fontSize: '14px' }}>
				<Grid container spacing={2}>
					<Grid item xs={2} sm={1} style={{ transform: 'translateY(-2px)' }}>
						<img
							{...longPressAvatarEvent}
							src={props.img}
							alt='profile'
							style={{ width: '24px', height: '24px' }}
						></img>
					</Grid>
					<Grid item xs={8} sm={10} style={{ fontSize: '14px' }}>
						<a
							href={`https://3.basecamp.com/4954106/reports/users/progress/${props.user_id}`}
							style={{
								// color:
								// 	props.active_todo === 0
								// 		? 'red'
								// 		: moment().diff(moment(props.last_active_at), 'hours') >= 3
								// 		? '#EDFC45'
								// 		: 'white' || userNameColor,
								color: setUserColor || 'red',
								paddingLeft: '2rem',
								fontSize: '14px'
							}}
							target='_blank'
							rel='noreferrer'
						>
							{props?.name?.split(' ')[0]}{' '}
						</a>
					</Grid>
				</Grid>
			</td>
			<td style={{ transform: 'translate(0, -3px)', fontSize: '14px' }}>
				<div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '30px' }}>
					{props.completed_todo && parseInt(props.completed_todo) !== 0
						? [...Array(props.completed_todo)]?.map((count, key) => {
								if (key !== 1 && key !== 0 && (key + 1) % 5 === 0) {
									return (
										<span
											style={{
												marginRight: '5px',
												fontSize: '14px'
											}}
											key={key}
										>
											<svg
												width='16'
												height='13'
												viewBox='0 0 16 13'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M13.2982 1.2859C13.5588 1.0378 13.9056 0.900638 14.2654 0.90336C14.6252 0.906083 14.9699 1.04848 15.2267 1.3005C15.4835 1.55252 15.6324 1.89445 15.6419 2.25414C15.6514 2.61384 15.5208 2.96316 15.2777 3.2284L7.89621 12.4599C7.76928 12.5966 7.61609 12.7063 7.44579 12.7824C7.2755 12.8586 7.09159 12.8996 6.90508 12.9031C6.71856 12.9065 6.53326 12.8723 6.36026 12.8025C6.18726 12.7327 6.03012 12.6288 5.89822 12.4969L1.00313 7.60178C0.866812 7.47476 0.757474 7.32158 0.681639 7.15138C0.605804 6.98118 0.565026 6.79745 0.561739 6.61115C0.558452 6.42485 0.592723 6.2398 0.662507 6.06703C0.73229 5.89427 0.836158 5.73732 0.967912 5.60557C1.09967 5.47381 1.25661 5.36995 1.42938 5.30016C1.60214 5.23038 1.7872 5.19611 1.9735 5.1994C2.1598 5.20268 2.34352 5.24346 2.51372 5.3193C2.68392 5.39513 2.8371 5.50447 2.96413 5.64079L6.83801 9.51283L13.263 1.3266C13.2746 1.31236 13.287 1.29877 13.3 1.2859H13.2982Z'
													fill='#14FF00'
												/>
											</svg>
											<br />
										</span>
									);
								}
								return (
									<span
										style={{
											marginRight: '5px',
											fontSize: '14px'
										}}
										key={key}
									>
										<svg
											width='16'
											height='13'
											viewBox='0 0 16 13'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M13.2982 1.2859C13.5588 1.0378 13.9056 0.900638 14.2654 0.90336C14.6252 0.906083 14.9699 1.04848 15.2267 1.3005C15.4835 1.55252 15.6324 1.89445 15.6419 2.25414C15.6514 2.61384 15.5208 2.96316 15.2777 3.2284L7.89621 12.4599C7.76928 12.5966 7.61609 12.7063 7.44579 12.7824C7.2755 12.8586 7.09159 12.8996 6.90508 12.9031C6.71856 12.9065 6.53326 12.8723 6.36026 12.8025C6.18726 12.7327 6.03012 12.6288 5.89822 12.4969L1.00313 7.60178C0.866812 7.47476 0.757474 7.32158 0.681639 7.15138C0.605804 6.98118 0.565026 6.79745 0.561739 6.61115C0.558452 6.42485 0.592723 6.2398 0.662507 6.06703C0.73229 5.89427 0.836158 5.73732 0.967912 5.60557C1.09967 5.47381 1.25661 5.36995 1.42938 5.30016C1.60214 5.23038 1.7872 5.19611 1.9735 5.1994C2.1598 5.20268 2.34352 5.24346 2.51372 5.3193C2.68392 5.39513 2.8371 5.50447 2.96413 5.64079L6.83801 9.51283L13.263 1.3266C13.2746 1.31236 13.287 1.29877 13.3 1.2859H13.2982Z'
												fill='#14FF00'
											/>
										</svg>
									</span>
								);
						  })
						: ''}

					<span style={{ marginLeft: '2rem' }}></span>
					{activeCount && activeCount !== 0
						? [
								...Array(
									activeCount - props.completed_todo <= 0
										? 0
										: activeCount - props.completed_todo > 0
										? activeCount - props.completed_todo
										: 0
								)
						  ]?.map((count, key) => {
								return (
									<span style={{ marginRight: '5px', fontSize: '14px' }}>
										<svg
											width='7'
											height='7'
											viewBox='0 0 7 7'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
											style={{ fontSize: '14px', transform: 'translateY(-40%)' }}
										>
											<circle cx='3.58691' cy='3.90332' r='3' fill='#666666' />
										</svg>
									</span>
								);
						  })
						: ''}
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
					href={`https://3.basecamp.com/4954106/reports/todos/assigned/${props.user_id}`}
					style={{
						color: props?.tasks > 15 || props?.tasks <= 2 ? 'red' : 'white',
						fontSize: '14px',
						alignContent: 'center'
					}}
					target='_blank'
					rel='noreferrer'
				>
					{props.tasks > 0 ? props.tasks : ''}
				</a>
			</td>
			<td style={{ textAlign: 'center', transform: 'translateX(-8px)' }}>
				<p
					style={{
						color:
							props.projects.length > 3 ? 'red' : props.projects.length === 1 ? '#98FB58' : 'white',
						fontSize: '13px',
						position: 'relative',
						display: 'inline-block'
					}}
					className='projectCount'
				>
					{props.projects.length > 0 ? props.projects.length : ''}
					<div style={{ display: 'inline-block' }} className='ProjectCounttip'>
						{props.projects.map((each, i) => {
							const projectname = getProjectname(each);

							return <div>{projectname}</div>;
						})}
					</div>
				</p>
			</td>
		</tr>
	);
};

export default TeamWork;
