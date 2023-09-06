import React, { useEffect, useState } from 'react';
import TeamWork from 'screens/TeamWork/TeamWork';
import styles from './BigDashboard.module.css';
import { TopStatistics } from './TopStatistics';
import ProjectsColumn from './ProjectsColumn';
import ActivitiesColumn from './ActivitiesColumn';
import moment from 'moment';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';

const BigDashboard = ({ selectedProject, setSelectedProject, timer }) => {
	/* ======================= Yogesh start ========================== */
	// State variables for column maximization
	const [isActivityMaximized, setIsActivityMaximized] = useState(true);
	const [isProjectMaximized, setIsProjectMaximized] = useState(true);
	const [isTeamWorkMaximized, setIsTeamWorkMaximized] = useState(true);

	const toggleMaximize = column => {
		setIsActivityMaximized(column === 'activity' ? !isActivityMaximized : false);
		setIsProjectMaximized(column === 'project' ? !isProjectMaximized : false);
		setIsTeamWorkMaximized(column === 'teamWork' ? !isTeamWorkMaximized : false);
	};
	/* ======================= Yogesh end ========================== */
	useEffect(() => {
		getTeamWorkData();
		setInterval(async () => getTeamWorkData(), 120000);
	}, []);

	const [totalTickets, setTotalTickets] = useState(0);
	const [completedTask, setCompletedTask] = useState(0);

	const localStorageData = localStorage.getItem('redwing_data');

	const [allusers, setAllUsers] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);

	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);

	const scrollTop = () => {
		window.scrollTo({ top: 0, behaviour: 'smooth' });
	};

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalTasks = teamMembers.reduce((acc, user) => {
				return acc + user.tasks_count;
			}, 0);
			if (totalTasks !== totalTickets) {
				setTotalTickets(totalTasks);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						teamLoad: totalTasks
					};
				});
			}
		}
	}, [allusers]);

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalCompleteTask = teamMembers.reduce((acc, user) => {
				return acc + user.completed_todo;
			}, 0);
			if (totalCompleteTask !== completedTask) {
				setCompletedTask(totalCompleteTask);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						taskCompleted: completedTask
					};
				});
			}
		}
	}, [allusers]);

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
				// console.log(res.data);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				setData(res.data);
				setAllUsers(res.data);
				setProjectData(res.data.projects);
				// setLoading(false);
			})
			.catch(error => {
				console.error(error);
				// setLoading(false);
			});
	};

	useEffect(() => {
		setTopStatisticsCount(() => {
			return {
				...topStatisticsCount,
				tasksToday: data.tickets_created_today
			};
		});
	}, [data]);

	const [topStatisticsCount, setTopStatisticsCount] = useState({
		hoursOfWeek: 0,
		completion: 0,
		worthOrders: '$0',
		tasksToday: data.tickets_created_today,
		teamLoad: totalTickets,
		taskCompleted: completedTask
	});
	useEffect(() => {
		// console.log(timer);
		setTopStatisticsCount(prev => {
			return {
				...prev,
				hoursOfWeek: timer.day,
				completion: moment().add(timer.day, 'hours').format('hh:mm')
			};
		});
	}, [timer]);
	return (
		<>
			{/* ======================= Yogesh Start ========================== */}
			<div className={styles.buttonTop}>
				<button onClick={() => toggleMaximize('teamWork')}>
					{isTeamWorkMaximized ? (
						<>
							<FontAwesomeIcon icon={faCompress} className={styles.icon} />
							{' Team Work'}
						</>
					) : (
						<>
							<FontAwesomeIcon icon={faExpand} className={styles.icon} />
							{' Team Work'}
						</>
					)}
				</button>
				<button onClick={() => toggleMaximize('activity')}>
					{isActivityMaximized ? (
						<>
							<FontAwesomeIcon icon={faCompress} className={styles.icon} />
							{' Activity'}
						</>
					) : (
						<>
							<FontAwesomeIcon icon={faExpand} className={styles.icon} />
							{' Activity'}
						</>
					)}
				</button>
				<button onClick={() => toggleMaximize('project')}>
					{isProjectMaximized ? (
						<>
							<FontAwesomeIcon icon={faCompress} className={styles.icon} />
							{' Project'}
						</>
					) : (
						<>
							<FontAwesomeIcon icon={faExpand} className={styles.icon} />
							{' Project'}
						</>
					)}
				</button>
			</div>
			{/* ======================= Yogesh End ========================== */}
			<div className={styles.bigdashboard}>
				<Helmet>
					<meta name='apple-mobile-web-app-capable' content='yes' />
				</Helmet>

				{/* <div className={styles.teamWork}> */}
				<div className={`${styles.teamWork} ${isTeamWorkMaximized ? styles.maximized : ''}`}>
					<div className={styles.outertopStatisticsBar}>
						<div className={styles.topStatisticsBar}>
							{/* ======================= Yogesh Start ========================== */}
							<button onClick={() => toggleMaximize('teamWork')}>
								{isTeamWorkMaximized ? (
									<FontAwesomeIcon icon={faCompress} className={styles.icon} />
								) : (
									<FontAwesomeIcon icon={faExpand} className={styles.icon} />
								)}
							</button>
							{/* ======================= Yogesh Ends ========================== */}
							<TopStatistics text={'Tasks Today'} count={topStatisticsCount.tasksToday} />
							<TopStatistics text={'Team Load'} count={totalTickets} />
							<TopStatistics text={'Completions'} count={completedTask} />
						</div>
					</div>
					{/* ======================= Yogesh Start ========================== */}
					<CSSTransition
						in={isTeamWorkMaximized}
						timeout={300}
						classNames={{
							enter: styles['column-maximize-enter'],
							enterActive: styles['column-maximize-enter-active'],
							exit: styles['column-maximize-exit'],
							exitActive: styles['column-maximize-exit-active']
						}}
						unmountOnExit
					>
						<div
							className={`${styles.alignTeamContent} ${
								isTeamWorkMaximized ? styles.maximized : ''
							}`}
						>
							{/* ======================= Yogesh Ends ========================== */}
							{/* <div className={styles.alignTeamContent}> */}
							<TeamWork
								isInverted={false}
								screenIndex={2}
								showTeamTabTop={false}
								showTabComponent={false}
								showActionButtons={false}
							/>
						</div>
						{/* ======================= Yogesh Start ========================== */}
					</CSSTransition>
					{/* ======================= Yogesh ends ========================== */}
				</div>
				{/* <div className={styles.activity}> */}
				<div className={`${styles.activity} ${isActivityMaximized ? styles.maximized : ''}`}>
					<div className={styles.outertopStatisticsBar}>
						<div className={styles.topStatisticsBar}>
							{/* ======================= Yogesh Start ========================== */}
							<button onClick={() => toggleMaximize('activity')}>
								{isActivityMaximized ? (
									<FontAwesomeIcon icon={faCompress} className={styles.icon} />
								) : (
									<FontAwesomeIcon icon={faExpand} className={styles.icon} />
								)}
							</button>
							{/* ======================= Yogesh End ========================== */}
							<TopStatistics text={'Hours of work'} count={topStatisticsCount.hoursOfWeek} />
							<TopStatistics text={'Completion'} count={topStatisticsCount.completion} />
						</div>
					</div>
					{/* ======================= Yogesh Start ========================== */}
					<CSSTransition
						in={isActivityMaximized}
						timeout={300}
						classNames={{
							enter: styles['column-maximize-enter'],
							enterActive: styles['column-maximize-enter-active'],
							exit: styles['column-maximize-exit'],
							exitActive: styles['column-maximize-exit-active']
						}}
						unmountOnExit
					>
						<div
							className={`${styles.alignActivitiesContent} ${
								isActivityMaximized ? styles.maximized : ''
							}`}
						>
							{/* ======================= Yogesh Ends ========================== */}
							{/* <div className={styles.alignActivitiesContent}> */}
							<ActivitiesColumn
								setTopStatisticsCount={setTopStatisticsCount}
								setSelectedProject={setSelectedProject}
								selectedProject={selectedProject}
							/>
						</div>
						{/* ======================= Yogesh Start ========================== */}
					</CSSTransition>
					{/* ======================= Yogesh ends ========================== */}
				</div>
				{/* <div className={styles.project}> */}
				<div className={`${styles.project} ${isProjectMaximized ? styles.maximized : ''}`}>
					<div className={styles.outertopStatisticsBar}>
						<div className={styles.topStatisticsBar}>
							{/* ======================= Yogesh Start ========================== */}
							<button onClick={() => toggleMaximize('project')}>
								{isProjectMaximized ? (
									<FontAwesomeIcon icon={faCompress} className={styles.icon} />
								) : (
									<FontAwesomeIcon icon={faExpand} className={styles.icon} />
								)}
							</button>
							{/* ======================= Yogesh Ends ========================== */}
							<TopStatistics text={'Worth Orders'} count={topStatisticsCount.worthOrders} />
						</div>
					</div>
					{/* <div className={styles.alignProjectsContent}>
					<ProjectsColumn setTopStatisticsCount={setTopStatisticsCount} />
				</div> */}
					{/* ======================= Yogesh Start ========================== */}
					<CSSTransition
						in={isProjectMaximized}
						timeout={300}
						classNames={{
							enter: styles['column-maximize-enter'],
							enterActive: styles['column-maximize-enter-active'],
							exit: styles['column-maximize-exit'],
							exitActive: styles['column-maximize-exit-active']
						}}
						unmountOnExit
					>
						<div
							className={`${styles.alignProjectsContent} ${
								isProjectMaximized ? styles.maximized : ''
							}`}
						>
							{/* ======================= Yogesh Ends ========================== */}
							{/* <div className={styles.alignProjectsContent}> */}
							<ProjectsColumn setTopStatisticsCount={setTopStatisticsCount} />
						</div>
						{/* ======================= Yogesh Start ========================== */}
					</CSSTransition>
					{/* ======================= Yogesh ends ========================== */}
				</div>
			</div>
			<div className='big-dashboard-footer' style={{ margin: '1rem' }}>
				<Link to='/homepage' onClick={scrollTop}>
					Go to Homepage
				</Link>
			</div>
		</>
	);
};

export default BigDashboard;

