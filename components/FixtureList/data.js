const data = [
    {
		quizId: 1,
        date: '28 April',
        time: '19:00',
        competition: 'Champions league',
        tour: '3rd Tour',
        city: 'London',
        friends: 1,
        teamHome: {
            name: 'Everton',
            icon: './xxx'
        },
        teamAway: {
            name: 'Chelsea',
            icon: './xxx'
        },
        completed: true
    },
    {
		quizId: 2,
        date: '28 April',
        time: '19:00',
        competition: 'Champions league',
        tour: '3rd Tour',
        city: 'London',
        friends: 32,
        teamHome: {
            name: 'Everton',
            icon: './xxx'
        },
        teamAway: {
            name: 'Chelsea',
            icon: './xxx'
        },
        completed: false
    },
    {
		quizId: 3,
        date: '29 April',
        time: '19:00',
        competition: 'Champions league',
        tour: '3rd Tour',
        city: 'London',
        friends: 0,
        teamHome: {
            name: 'Chelsea',
            icon: './xxx'
        },
        teamAway: {
            name: 'Arsenal',
            icon: './xxx'
        },
        completed: false
    },
    {
		quizId: 1,
        date: '29 April',
        time: '19:00',
        competition: 'Unknown tournament',
        tour: '3rd Tour',
        city: 'London',
        friends: 12,
        teamHome: {
            name: 'Everton',
            icon: './xxx'
        },
        teamAway: {
            name: 'Manchester City',
            icon: './xxx'
        },
        completed: false
    }
];

export default data.concat(data.concat(data));
