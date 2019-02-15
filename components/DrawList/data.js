const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
const data = [
	{
		drawId: 1,
		endDateTime: '2016-05-10T03:25:00',
		name: 'Everton Home Shirt',
		picture: './images/t-shirt.png',
		description: text,
		friends: 10,
		bet: 20,
		completed: false
	},
	{
		drawId: 2,
		endDateTime: '2016-04-23T03:25:00',
		name: 'Everton Home Infant Kit',
		picture: './images/t-shirt3.png',
		description: text,
		friends: 10,
		bet: 20,
		completed: false
	},
	{
		drawId: 3,
		endDateTime: '2016-04-28T03:25:00',
		name: 'Everton Home Kit',
		picture: './images/t-shirt2.png',
		description: text,
		friends: 10,
		bet: 20,
		completed: false
	}
];

export default data.concat(data, data, data, data, data);
